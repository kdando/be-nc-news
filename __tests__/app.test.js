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
                if (topics.length > 0) {
                    expect(result.status).toBe(200);
                    topics.forEach((resultItem) => {
                    expect(resultItem).toHaveProperty("slug");
                    expect(resultItem).toHaveProperty("description");
                    })
                }
            })
        })
    //Error handling tests
        test("Status: 404 and appropriate message if query returns nothing from database", () => {
            return supertest(app)
            .get("/api/topics")
            .then((result) => {
                const topics = result.body.topics
                if (topics.length === 0) {
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
            //test variable for parametric endpoint
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
            //new test variable
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
                articles.forEach((articleObject) => {
                    expect(articleObject).toHaveProperty("comment_count");
                    expect(Number(articleObject.comment_count)).not.toBeNaN();
                })
            })
        })
    })

    describe("GET /api/articles/:article_id/comments", () => {
    // Functionality tests

        

        test("Status: 200 should return an array", () => {
            //test variable for parametric endpoint
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
            //new test variable
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
            //new test variable
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

})

describe("app core POST requests", () => {

    describe("POST /api/articles/:article_id/comments", () => {
    //Functionality tests
        test("Status: 201 should return the posted comment", () => {
            //test variable for parametric endpoint
            const article_id = 3;
            //test comment for post request
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
            //test variable for parametric endpoint
            const article_id = 6;
            //test comment for post request
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
            //test variable for parametric endpoint
            const article_id = 1;
            //test comment for post request
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
            //test variable for parametric endpoint
            const article_id = "pinecone";
            //test comment for post request
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
            //test variable for parametric endpoint
            const article_id = 777;
            //test comment for post request
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