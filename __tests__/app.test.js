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


describe("app GET requests", () => {

    describe("GET /api/topics", () => {
    //Functionality tests
        test("Status: 200 should return an array", () => {
            return supertest(app)
            .get("/api/topics")
            .then((result) => {
                expect(200);
                expect(Array.isArray(result.body)).toBe(true);
            })
        })
        test("returned objects should have 'slug' and 'description' properties", () => {
            return supertest(app)
            .get("/api/topics")
            .then((result) => {
                if (result.body.length > 0) {
                    result.body.forEach((resultItem) => {
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
                if (result.body.length === 0) {
                    expect(404);
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
                expect(200);
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
        //test variable for parametric endpoint
        const article_id = 3;

    //Functionality tests
        test("Status: 200 should return a single object", () => {
            return supertest(app)
            .get(`/api/articles/${article_id}`)
            .then((result) => {
                expect(200);
                expect(result.body).toBeInstanceOf(Object);
                expect(Array.isArray(result.body)).toBe(false);
            })
        })
        test("returned article object has expected properties in expected formats", () => {
            return supertest(app)
            .get(`/api/articles/${article_id}`)
            .then((result) => {
                expect(200);
                expect(result.body).toHaveProperty("author", expect.any(String));
                expect(result.body).toHaveProperty("title", expect.any(String));
                expect(result.body).toHaveProperty("article_id", expect.any(Number));
                expect(result.body).toHaveProperty("body", expect.any(String));
                expect(result.body).toHaveProperty("topic", expect.any(String));
                expect(result.body).toHaveProperty("created_at", expect.any(String));
                expect(result.body).toHaveProperty("votes", expect.any(Number));
                expect(result.body).toHaveProperty("article_img_url", expect.any(String));
            })
        })
    //Error handling tests
        test("Status: 400 and appropriate message if invalid article_id", () => {
            return supertest(app)
            .get(`/api/articles/banana`)
            .then((result) => {
                expect(400);
                expect(result.body.msg).toBe("Invalid article id.")
            })
        })
        test("Status: 404 and appropriate message if valid but non-existent article_id", () => {
            return supertest(app)
            .get("/api/articles/333")
            .then((result) => {
                expect(404);
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
                expect(200);
                expect(Array.isArray(result.body)).toBe(true);
            })
        })
        test("objects in array should be sorted by date, descending", () => {
            return supertest(app)
            .get("/api/articles")
            .then((result) => {
                expect(200);
                expect(result.body).toBeSortedBy("created_at", {descending: true});
            })
        })
        test("objects in array should not include body", () => {
            return supertest(app)
            .get("/api/articles")
            .then((result) => {
                expect(200);
                result.body.forEach((object) => {
                    expect(object).not.toHaveProperty("body");
                })
            })
        })
        test("objects in array should include comment_count", () => {
            return supertest(app)
            .get("/api/articles")
            .then((result) => {
                expect(200);
                result.body.forEach((object) => {
                    expect(object).toHaveProperty("comment_count");
                    expect(Number(object.comment_count)).not.toBeNaN();
                })
            })
        })
    })

    describe("GET /api/articles/:article_id/comments", () => {
    // Functionality tests

        //test variable for parametric endpoint
        const article_id = 1;

        test("Status: 200 should return an array", () => {
            return supertest(app)
            .get(`/api/articles/${article_id}/comments`)
            .then((result) => {
                expect(200);
                expect(Array.isArray(result.body)).toBe(true);
            })
        })
        test("array should be sorted by date, most recent first", () => {
            return supertest(app)
            .get(`/api/articles/${article_id}/comments`)
            .then((result) => {
                expect(200);
                expect(result.body).toBeSortedBy("created_at", {descending: true});
            })
        })
        test("array objects should have expected properties and values", () => {
            return supertest(app)
            .get(`/api/articles/${article_id}/comments`)
            .then((result) => {
                const firstComment = result.body[0];
                expect(firstComment.article_id).toBe(article_id);
                expect(firstComment.author).toBe("icellusedkars");
                expect(firstComment.comment_id).toBe(5);
                expect(firstComment.votes).toBe(0);
                expect(firstComment.created_at).toBe("2020-11-03T21:00:00.000Z");
                expect(firstComment.body).toBe("I hate streaming noses");
            })
        })

    //Error handling tests
        test("Status: 404 and appropriate message if article present but has no comments", () => {
            return supertest(app)
            .get("/api/articles/7/comments")
            .then((result) => {
                expect(404);
                expect(result.body.msg).toBe("Article has no comments.")
            })
        })
        test("Status: 404 and appropriate message if valid but non-existent article_id", () => {
            return supertest(app)
            .get("/api/articles/333/comments")
            .then((result) => {
                expect(404);
                expect(result.body.msg).toBe("No article with that id found.")
            })
        })
        test("Status: 400 and appropriate message if invalid article_id", () => {
            return supertest(app)
            .get("/api/articles/cupcake/comments")
            .then((result) => {
                expect(404);
                expect(result.body.msg).toBe("Invalid article id.")
            })
        })

    })



})