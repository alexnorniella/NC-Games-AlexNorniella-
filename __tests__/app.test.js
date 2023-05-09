const request = require("supertest");
const app = require("../app")
const connection = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index");
const { beforeAll } = require("@jest/globals");
const { Console } = require("console");


beforeEach(() => seed(testData))
afterAll(() => connection.end())


describe('/api/categories', () => {
    test('GET-Status: 200 - responds with array of all categories ', () => {
        return request(app).get("/api/categories").expect(200).then(({ body }) => {
            //console.log(body.treasures);
            expect(typeof body.categories).toBe("object");
            body.categories.forEach((category) => {
                expect(typeof category.slug).toBe('string');
                expect(typeof category.description).toBe('string');

            })
        })
    });

});
