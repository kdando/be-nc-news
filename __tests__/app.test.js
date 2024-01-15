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


describe("app.js GET requests", () => {

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

        //Create random number within range of test data values for parametric endpoint testing
        let article_id = Math.floor(Math.random()*(15-1))+1;
        console.log(article_id)

    //Functionality tests
        test("Status: 200 should return a single object", () => {
            return supertest(app)
            .get(`/api/articles/${article_id}`)
            .then((result) => {
                console.log(result.body);
                expect(200);
                expect(result.body).toBeInstanceOf(Object);
                expect(Array.isArray(result.body)).toBe(false);
            })
        })

    })



})