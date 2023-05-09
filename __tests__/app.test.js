const request = require("supertest");
const app = require("../app")
const connection = require("../db/connection")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data/index");
const { beforeAll } = require("@jest/globals");
const { Console } = require("console");


beforeEach(() => seed(testData))
afterAll(() => connection.end())

describe('invalid endpoint', () => {
    test('Get- Status: 404 - responds with an error message', () => {
        return request(app).get("/api/banana").expect(404).then(({ body }) => {
            expect(body.message).toBe("invalid end point")
        })

    });

});
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

describe("/api/reviews/:review_id", () => {
    test('GET-Status: 200 - responds with a single review', () => {
        return request(app).get("/api/reviews/2").expect(200).then(({ body }) => {
            //console.log(body.treasures);
            expect(body.review.review_id).toBe(2);
            expect(body.review.title).toBe('Jenga')


        })
    });
    test('GET-Status:404 - responds with an error when a request is made for a review that doesnt exits', () => {
        return request(app).get('/api/reviews/10000').expect(404).then(({ body }) => {
            expect(body.message).toBe('not found')
        })

    });


});

