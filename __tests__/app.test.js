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
describe('/api/reviews', () => {
    test('GET-Status: 200 - responds with array of all reviews ', () => {
        return request(app).get("/api/reviews").expect(200).then(({ body }) => {

            expect(Array.isArray(body.reviews)).toBe(true)
            body.reviews.forEach((review) => {
                expect(review).toHaveProperty('title');
                expect(typeof review.title).toBe('string');

                expect(review).toHaveProperty('designer');
                expect(typeof review.designer).toBe('string');

                expect(review).toHaveProperty('owner');
                expect(typeof review.owner).toBe('string');

                expect(review).toHaveProperty('review_img_url');
                expect(typeof review.review_img_url).toBe('string');

                expect(review).toHaveProperty('category');
                expect(typeof review.category).toBe('string');

                expect(review).toHaveProperty('created_at');
                expect(typeof review.created_at).toBe('string');

                expect(review).toHaveProperty('votes');
                expect(typeof review.votes).toBe('number');
            })
        })
    });
    test('GET-Status: 200 - responds with array of all reviews and had a count with number ', () => {
        return request(app).get("/api/reviews").expect(200).then(({ body }) => {

            body.reviews.forEach((review) => {
                expect(review).toHaveProperty('comment_count')
                expect(typeof review.comment_count).toBe('number')
            })

        });
    })
    test('GET-Status: 200 - responds with array of all reviews in descending order', () => {
        return request(app).get("/api/reviews").expect(200).then(({ body }) => {
            console.log(body.reviews, 'body')
            expect(body.reviews).toBeSortedBy('created_at', {
                descending: true,

            })

        });
    })
})