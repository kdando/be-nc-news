//require the server, connection, seed file and test data
const app = require("../app")
const connection = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")

//require supertest
const supertest = require("supertest");

//require endpoints file for comparison in tests
const endpoints = require("../endpoints.json")

//seed database with test data before each test, end connection to database after all tests
beforeEach(() => {
    return seed(testData);
})
afterAll(() => {
    return connection.end();
})

//TESTS FOR CORE FUNCTIONALITY
describe("app core GET requests", () => {

    describe("GET /api/topics", () => {
    //Functionality tests
        test("Status: 200 should return an array", () => {
            return supertest(app)
            .get("/api/topics")
            .then((result) => {
                expect(result.status).toBe(200);
                const topics = result.body.topics
                expect(Array.isArray(topics)).toBe(true);
            })
        })
        test("returned objects should have 'slug' and 'description' properties", () => {
            return supertest(app)
            .get("/api/topics")
            .then((result) => {
                const topics = result.body.topics
                expect(topics.length).toBe(3);
                    expect(result.status).toBe(200);
                    topics.forEach((resultItem) => {
                        expect(resultItem).toHaveProperty("slug");
                        expect(resultItem).toHaveProperty("description");
                    })
            })
        })
    //Error handling tests
        test("Status: 404 and appropriate message if query returns nothing from database", () => {
            return supertest(app)
            .get("/api/topics")
            .then((result) => {
                if (!result.body.topics) {
                    expect(result.status).toBe(404);
                    expect(result.msg).toBe("No topics found.")
                }
            })
        })
        test("Status: 400 and appropriate message if invalid path", () => {
            return supertest(app)
            .get("/api/not-a-path")
            .then((result) => {
                expect(400);
                expect(result.body.msg).toBe("Path does not exist.")
            })
        })
    })

    describe("GET /api", () => {
    //Functionality tests
        test("Status: 200 should return an object", () => {
            return supertest(app)
            .get("/api")
            .then((result) => {
                expect(result.status).toBe(200);
                expect(typeof result.body).toBe("object");
            })
        })
        test("returned object should match our endpoints.json", () => {
            return supertest(app)
            .get("/api")
            .then((result) => {
                expect(result.body).toEqual(endpoints)
            })
        })
    })

    describe("GET /api/articles/:article_id", () => {     
    //Functionality tests
        test("Status: 200 should return a single object", () => {        
            const article_id = 5;
            return supertest(app)
            .get(`/api/articles/${article_id}`)
            .then((result) => {
                const article = result.body.article;
                expect(result.status).toBe(200);
                expect(article).toBeInstanceOf(Object);
                expect(Array.isArray(article)).toBe(false);
            })
        })
        test("returned article object has expected properties with expected values", () => {         
            const article_id = 3;
            return supertest(app)
            .get(`/api/articles/${article_id}`)
            .then((result) => {
                expect(result.status).toBe(200);
                const article = result.body.article;
                expect(article.article_id).toBe(article_id);
                expect(article.author).toBe("icellusedkars");
                expect(article.title).toBe("Eight pug gifs that remind me of mitch");
                expect(article.topic).toBe("mitch");
                expect(article.body).toBe("some gifs");
                expect(article.created_at).toBe("2020-11-03T09:12:00.000Z");
                expect(article.votes).toBe(0);
                expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
                expect(article.comment_count).toBe(2);
            })
        })
    //Error handling tests
        test("Status: 400 and appropriate message if invalid article_id", () => {
            return supertest(app)
            .get(`/api/articles/banana`)
            .then((result) => {
                expect(result.status).toBe(400);
                expect(result.body.msg).toBe("Invalid article id.")
            })
        })
        test("Status: 404 and appropriate message if valid but non-existent article_id", () => {
            return supertest(app)
            .get("/api/articles/333")
            .then((result) => {
                expect(result.status).toBe(404);
                expect(result.body.msg).toBe("No article with that id found.")
            })
        })
    })

    describe("GET api/articles", () => {
    //Functionality tests
        test("Status: 200 should return an array", () => {
            return supertest(app)
            .get("/api/articles/")
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles
                expect(Array.isArray(articles)).toBe(true);
            })
        })
        test("objects in array should be sorted by date, descending", () => {
            return supertest(app)
            .get("/api/articles")
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles
                expect(articles).toBeSortedBy("created_at", {descending: true});
            })
        })
        test("objects in array should not include body", () => {
            return supertest(app)
            .get("/api/articles")
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles
                expect(articles.length).toBe(13);
                articles.forEach((articleObject) => {
                    expect(articleObject).not.toHaveProperty("body");
                })
            })
        })
        test("objects in array should include comment_count", () => {
            return supertest(app)
            .get("/api/articles")
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles
                expect(articles.length).toBe(13);
                articles.forEach((articleObject) => {
                    expect(articleObject).toHaveProperty("comment_count");
                    expect(typeof articleObject.comment_count).toBe("number");
                })
            })
        })
    })

    describe("GET /api/articles/:article_id/comments", () => {
    // Functionality tests
        test("Status: 200 should return an array", () => { 
            const article_id = 5;
            return supertest(app)
            .get(`/api/articles/${article_id}/comments`)
            .then((result) => {
                expect(result.status).toBe(200);
                const comments = result.body.comments
                expect(Array.isArray(comments)).toBe(true);
            })
        })
        test("array should be sorted by date, most recent first", () => {
            
            const article_id = 9;
            return supertest(app)
            .get(`/api/articles/${article_id}/comments`)
            .then((result) => {
                expect(result.status).toBe(200);
                const comments = result.body.comments
                expect(comments).toBeSortedBy("created_at", {descending: true});
            })
        })
        test("array objects should have expected properties and values", () => {
            
            const article_id = 1;
            return supertest(app)
            .get(`/api/articles/${article_id}/comments`)
            .then((result) => {
                expect(result.status).toBe(200);
                const firstComment = result.body.comments[0];
                expect(firstComment.article_id).toBe(article_id);
                expect(firstComment.author).toBe("icellusedkars");
                expect(firstComment.comment_id).toBe(5);
                expect(firstComment.votes).toBe(0);
                expect(firstComment.created_at).toBe("2020-11-03T21:00:00.000Z");
                expect(firstComment.body).toBe("I hate streaming noses");
            })
        })
        test("Status: 200 and appropriate message if article present but has no comments", () => {
            return supertest(app)
            .get("/api/articles/7/comments")
            .then((result) => {
                expect(result.status).toBe(200);
                expect(result.body.msg).toBe("Article has no comments.")
            })
        })

    //Error handling tests
        test("Status: 404 and appropriate message if valid but non-existent article_id", () => {
            return supertest(app)
            .get("/api/articles/333/comments")
            .then((result) => {
                expect(result.status).toBe(404);
                expect(result.body.msg).toBe("No article with that id found.")
            })
        })
        test("Status: 400 and appropriate message if invalid article_id", () => {
            return supertest(app)
            .get("/api/articles/cupcake/comments")
            .then((result) => {
                expect(result.status).toBe(400);
                expect(result.body.msg).toBe("Invalid article id.")
            })
        })
    })

    describe("GET /api/users", () => {
    //Functionality tests
        test("Status: 200 should return an array", () => {
            return supertest(app)
            .get("/api/users/")
            .then((result) => {
                expect(result.status).toBe(200);
                const users = result.body.users
                expect(Array.isArray(users)).toBe(true);
            })
        })
        test("user objects should have expected properties and values", () => {
            return supertest(app)
            .get("/api/users/")
            .then((result) => {
                expect(result.status).toBe(200);
                const thirdUser = result.body.users[2]
                expect(thirdUser.username).toBe("rogersop");
                expect(thirdUser.name).toBe("paul");
                expect(thirdUser.avatar_url).toBe("https://avatars2.githubusercontent.com/u/24394918?s=400&v=4");
            }) 
        })
    //Error handling tests
        test("Status: 404 and appropriate message if query returns nothing from database", () => {
            return supertest(app)
            .get("/api/users")
            .then((result) => {
                if (!result.body.users) {
                    expect(result.status).toBe(404);
                    expect(result.msg).toBe("No users found.")
                }
            })
        })
    })

    describe("GET /api/articles (topic query)", () => {
    //Functionality tests
        test("Status: 200 should respond with an array of articles", () => {
            const testTopic = "mitch";
            return supertest(app)
            .get(`/api/articles?topic=${testTopic}`)
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles
                expect(Array.isArray(articles)).toBe(true);
            })
        });

        test("resulting array should only include articles for the queried topic", () => {
            const testTopic = "cats";
            return supertest(app)
            .get(`/api/articles?topic=${testTopic}`)
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles
                expect(articles.length).toBe(1);
                articles.forEach((article) => {
                    expect(article.topic).toBe(`${testTopic}`)
                })
            })
        });

    //Error handling tests
        test("Status: 404 and appropriate message if topic does not exist", () => {
            const testTopic = "nuclear_secrets"
            return supertest(app)
            .get(`/api/articles?topic=${testTopic}`)
            .then((result) => {
                expect(result.status).toBe(404);
                expect(result.body.msg).toBe("No topic with that name found.")
            })
        });
        test("Status: 200 and appropriate message if topic exists but has no articles", () => {
            const testTopic = "paper"
            return supertest(app)
            .get(`/api/articles?topic=${testTopic}`)
            .then((result) => {
                expect(result.status).toBe(200);
                expect(result.body.msg).toBe("No articles found for that topic.")
            })
        });


    })

})

describe("app core POST requests", () => {

    describe("POST /api/articles/:article_id/comments", () => {
    //Functionality tests
        test("Status: 201 should return the posted comment", () => {          
            const article_id = 3;        
            const newComment = {
                "username": "lurker",
                "body": "I don't know where I am."
            };
            return supertest(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .then((result)=> {;
                
                expect(result.status).toBe(201);
                const comment = result.body.comment;
                expect(comment.author).toBe(newComment.username);
                expect(comment.body).toBe(newComment.body)
            })
        })

    //Error handling tests
        test("Status: 404 and appropriate message if username not in database", () => {
            const article_id = 6;         
            const newComment = {
                "username": "GenuineHumanBeing",
                "body": "Total freedom in 3 easy steps!!CLICKHERE"
            };
            return supertest(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .then((result) => {
                expect(result.status).toBe(404);
                expect(result.body.msg).toBe("No user with that name found.")
            })
        })

        test("Status: 400 and appropriate message if request comment object missing necessary properties", () => {         
            const article_id = 1;          
            const newComment = {
                "username": "butter_bridge",
            };
            return supertest(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .then((result) => {
                expect(result.status).toBe(400);
                expect(result.body.msg).toBe("Comment must have username and body.")
            })
        })

        test("Status: 400 and appropriate message if invalid article_id", () => {         
            const article_id = "pinecone";          
            const newComment = {
                "username": "lurker",
                "body": "The secret to life is..."
            };
            return supertest(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .then((result) => {
                expect(result.status).toBe(400);
                expect(result.body.msg).toBe("Invalid article id.")
            })
        })
        test("Status: 404 and appropriate message if valid but non-existent article_id", () => {
            const article_id = 777;
            const newComment = {
                "username": "lurker",
                "body": "Wait this time I've got it..."
            };
            return supertest(app)
            .post(`/api/articles/${article_id}/comments`)
            .send(newComment)
            .then((result) => {
                expect(result.status).toBe(404);
                expect(result.body.msg).toBe("No article with that id found.")
            })
        })

    })

})

describe("app core PATCH requests", () => {

    describe("PATCH /api/articles/:article_id", () => {
    //Functionality tests
        test("Status: 200 should respond with updated article", () => {
            const article_id = 3;
            const newVotes = {
                "inc_votes": 100
            };
            return supertest(app)
            .patch(`/api/articles/${article_id}`)
            .send(newVotes)
            .then((result) => {
                expect(result.status).toBe(200)
                const article = result.body.article;
                expect(article).toBeInstanceOf(Object);
                expect(Array.isArray(article)).toBe(false);
                expect(article.votes).toBe(100)
            })
        })
        test("article's 'votes' key value is correctly adjusted, all other keys remain present and unchanged", () => {
            const article_id = 1;
            const newVotes = {
                "inc_votes": -50
            };
            return supertest(app)
            .patch(`/api/articles/${article_id}`)
            .send(newVotes)
            .then((result) => {
                expect(result.status).toBe(200)
                const article = result.body.article;
                expect(article.votes).toBe(50);
                expect(article.title).toBe("Living in the shadow of a great man");
                expect(article.topic).toBe("mitch");
                expect(article.author).toBe("butter_bridge");
                expect(article.body).toBe("I find this existence challenging");
                expect(article.created_at).toBe("2020-07-09T20:11:00.000Z");
                expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
            })
        })
    //Error handling tests
        test("Status: 400 if inc_votes is note a number", () => {
            const article_id = 9;
            const newVotes = {
                "inc_votes": "one hundred"
            };
            return supertest(app)
            .patch(`/api/articles/${article_id}`)
            .send(newVotes)
            .then((result) => {
                expect(result.status).toBe(400)
                expect(result.body.msg).toBe("Votes must be a number.");
            })
        })
        test("Status: 400 if request object is malformed", () => {
            const article_id = 9;
            const newVotes = {
                "increase_vote_total": 1000
            };
            return supertest(app)
            .patch(`/api/articles/${article_id}`)
            .send(newVotes)
            .then((result) => {
                expect(result.status).toBe(400)
                expect(result.body.msg).toBe("Requires an 'inc_votes' key.");
            })
        })
        test("Status: 404 and appropriate message if trying to patch a valid but non-existent article_id", () => {
            const article_id = 9999;
            const newVotes = {
                "inc_votes": 2
            };
            return supertest(app)
            .patch(`/api/articles/${article_id}`)
            .send(newVotes)
            .then((result) => {
                expect(result.status).toBe(404)
                expect(result.body.msg).toBe("No article with that id found.");
            })
        })
        test("Status: 400 and appropriate message if trying to patch an invalid article_id", () => {
            const article_id = "bottom";
            const newVotes = {
                "inc_votes": 200000
            };
            return supertest(app)
            .patch(`/api/articles/${article_id}`)
            .send(newVotes)
            .then((result) => {
                expect(result.status).toBe(400)
                expect(result.body.msg).toBe("Invalid article id.");
            })
        })
    })

})

describe("app core DELETE requests", () => {

    describe("DELETE /api/comments/:comment_id", () => {
    //Functionality tests
        test("Status: 204 for successful deletion should return no content", () => {
            const comment_id = 2;
            return supertest(app)
            .delete(`/api/comments/${comment_id}`)
            .then((result) => {
                expect(result.status).toBe(204);
                expect(result.body).toEqual({});
            })
        })
    //Error handling tests
        test("Status: 400 and appropriate message if comment id invalid.", () => {
            const comment_id = "worst comment";
            return supertest(app)
            .delete(`/api/comments/${comment_id}`)
            .then((result) => {
                expect(result.status).toBe(400);
                expect(result.body.msg).toEqual("Invalid comment id.");
            })
        })
        test("Status: 404 and appropriate message if comment id valid but not present.", () => {
            const comment_id = 888;
            return supertest(app)
            .delete(`/api/comments/${comment_id}`)
            .then((result) => {
                expect(result.status).toBe(404);
                expect(result.body.msg).toEqual("No comment with that id found.");
            })
        })
    })

})

//TESTS FOR ADVANCE FUNCTIONALITY
describe("app advanced GET requests", () => {

    describe("GET /api/articles (sorting queries)", () => {
    //Functionality tests
        test("Status: 200 should default to sorted by created_at, descending if no queries supplied", () => {
            return supertest(app)
            .get("/api/articles")
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles
                expect(articles).toBeSortedBy("created_at", {descending: true});
            })
        });
        test("should return results sorted by any valid column if query supplied, order still defaulting to descending", () => {
            return supertest(app)
            .get("/api/articles?sorted_by=votes")
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles
                expect(articles).toBeSortedBy("votes", {descending: true});
            })
        });
        test("results should use both query parameters if supplied", () => {
            return supertest(app)
            .get("/api/articles?sorted_by=comment_count&order=asc")
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles
                expect(articles).toBeSortedBy("comment_count", {ascending: true});
            })
        })
        test("results are as expected for combination of queries, including topic", () => {
            return supertest(app)
            .get("/api/articles?topic=mitch&sorted_by=comment_count&order=desc")
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles;
                expect(articles).toBeSortedBy("comment_count", {descending: true});
                expect(articles.length).toBe(12);
                articles.forEach((article) => {
                    expect(article.topic).toBe("mitch")
                })
            })
        })
        test("results can take queries in any order", () => {
            return supertest(app)
            .get("/api/articles?order=asc&sorted_by=votes&topic=mitch")
            .then((result) => {
                expect(result.status).toBe(200);
                const articles = result.body.articles;
                expect(articles).toBeSortedBy("votes", {descending: false});
                expect(articles.length).toBe(12);
                articles.forEach((article) => {
                    expect(article.topic).toBe("mitch")
                })
            })
        })

    //Error handling tests
        test("Status: 400 and appropriate message if attempting to sort by column that doesn't exist", () => {
            return supertest(app)
            .get("/api/articles?sorted_by=coolness")
            .then((result) => {
                expect(result.status).toBe(400);
                expect(result.body.msg).toBe("Can only sort by available columns.")
            })
        })
        test("Status: 400 and appropriate message if attempting to order by anything other than 'asc' or 'desc'", () => {
            return supertest(app)
            .get("/api/articles?order=smallest_first")
            .then((result) => {
                expect(result.status).toBe(400);
                expect(result.body.msg).toBe("Can only order by ascending or descending.")
            })
        })
    })

})