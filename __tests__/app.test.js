//require the server, connection, seed file and test data
const app = require("../app")
const connection = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index")

//require supertest
const supertest = require("supertest");

//seed database with test data before each test, end connection to database after all tests
beforeEach(() => {
    return seed(testData);
})
afterAll(() => {
    return connection.end();
})

describe("app.js GET requests", () => {

    describe("GET /api/topics", () => {
        test("Status: 200 should return an array", () => {
            return supertest(app)
            .get("/api/topics")
            .then((result) => {
                expect(200);
                expect(Array.isArray(result.body)).toBe(true);
            })
        })

    })

})