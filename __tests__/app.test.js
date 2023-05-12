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
            expect(body.reviews).toBeSortedBy('created_at', {
                descending: true,

            })

        });
    })
})

describe("/api/reviews/:review_id", () => {
    test('GET-Status: 200 - responds with a single review', () => {
        return request(app).get("/api/reviews/2").expect(200).then(({ body }) => {
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

describe('/api/reviews/:review_id/comments', () => {

    test('GET- status:200- responds with an array of comments for the given review_id ', () => {
        return request(app).get("/api/reviews/2/comments").expect(200).then(({ body }) => {

            expect(Array.isArray(body.comments)).toBe(true)

            body.comments.forEach((comment) => {
                expect(comment.review_id).toBe(2);
                expect(comment).toHaveProperty('author');
                expect(typeof comment.author).toBe('string');
            })

        })


    });

    test('GET-Status: 200 - responds with array of all comments in descending order', () => {
        return request(app).get("/api/reviews/2/comments").expect(200).then(({ body }) => {
            expect(body.comments).toBeSortedBy('created_at', {
                descending: true,

            })

        });
    })
    test('GET-Status: 200 - responds with an empty array when a review id is provided but there are not comments', () => {
        return request(app).get("/api/reviews/1/comments").expect(200).then(({ body }) => {
            expect(body.comments).toEqual([])
        })

    });
    test('Get- Status: 404 valid but non-existent review ID ', () => {
        return request(app).get("/api/reviews/1000/comments").expect(404).then(({ body }) => {
            expect(body.message).toBe("not found")
        })

    });
    test('"GET-status : 400 - invalid review ID  "', () => {
        return request(app).get("/api/reviews/hi/comments").expect(400).then(({ body }) => {
            expect(body.message).toBe("invalid ID")
        })
    });
})

describe('/api/reviews/:review_id/comments', () => {
    test('POST- status:201- responds with the added comment object', () => {
        const newComment = { username: 'bainesface', body: 'this is the story about a pickle' }
        return request(app).post('/api/reviews/1/comments').send(newComment).expect(201).then(({ body }) => {
            expect(body.newComment).toBeInstanceOf(Object)
            expect(body.newComment.author).toBe('bainesface')
            expect(body.newComment.body).toBe('this is the story about a pickle')
        })
    })
    test('POST- status:201- responds with the added comment object going to ignore additional properties', () => {
        const newComment = { username: 'bainesface', body: 'this is the story about a pickle', magic: 'nc magic' }
        return request(app).post('/api/reviews/1/comments').send(newComment).expect(201).then(({ body }) => {
            expect(body.newComment).toBeInstanceOf(Object)
            expect(body.newComment.author).toBe('bainesface')
            expect(body.newComment.body).toBe('this is the story about a pickle')
        })
    })

    test('POST- status:404- when passing a author that doesnt exist in db', () => {
        const newComment = { username: 'pickle', body: 'this is the story about a pickle' }
        return request(app).post('/api/reviews/1/comments').send(newComment).expect(404).then(({ body }) => {
            expect(body.message).toBe('not found')
        })
    })

    test('POST- status:404- when passing a review_id that doesnt exist in db', () => {
        const newComment = { username: 'pickle', body: 'this is the story about a pickle' }
        return request(app).post('/api/reviews/1000/comments').send(newComment).expect(404).then(({ body }) => {
            expect(body.message).toBe('not found')
        })
    })

    test('POST- status:400- when passing a incorrect body', () => {
        const newComment = { username: 'bainesface' }
        return request(app).post('/api/reviews/1/comments').send(newComment).expect(400).then(({ body }) => {
            expect(body.message).toBe('missing required information')
        })
    })

    test('POST- status:400- when passing a incorrect review_id', () => {
        const newComment = { username: 'bainesface' }
        return request(app).post("/api/reviews/hi/comments").expect(400).then(({ body }) => {
            expect(body.message).toBe("invalid ID")
        })
    })
})

describe('/api/reviews/:review_id', () => {

    test('PATCH - status:200 - responds with the updated review object', () => {
        const newVote = { inc_votes: 1 };
        return request(app)
            .patch('/api/reviews/3')
            .send(newVote)
            .expect(200)
            .then(({ body }) => {
                expect(body.updatedReview).toBeInstanceOf(Object);
                expect(body.updatedReview.votes).toBe(6); // Assuming the original review had 5 votes
            });
    });

    test('PATCH - status:200 - decrements the review votes by 100', () => {
        const newVote = { inc_votes: -100 };
        return request(app)
            .patch('/api/reviews/12')
            .send(newVote)
            .expect(200)
            .then(({ body }) => {
                expect(body.updatedReview).toBeInstanceOf(Object);
                expect(body.updatedReview.votes).toBe(0); // Assuming the original review had 100 votes
            });
    });

    test('PATCH - status:404 - when passing a review_id that doesnt exist in db', () => {
        const newVote = { inc_votes: 1 };
        return request(app)
            .patch('/api/reviews/1000')
            .send(newVote)
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('Review not found');
            });
    });

    test('PATCH - status:400 - when passing an incorrect review_id', () => {
        const newVote = { inc_votes: 1 };
        return request(app)
            .patch('/api/reviews/banana')
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('invalid ID');
            });
    });
    test('PATCH - status:400 - when passing an incorrect body', () => {
        const newVote = { banana: 1 };
        return request(app)
            .patch('/api/reviews/3')
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('missing required information');
            });
    });
    test('PATCH - status:400 - when passing an incorrect body, example   when inc_votes property is not a number', () => {
        const newVote = { inc_votes: " banana" };
        return request(app)
            .patch('/api/reviews/3')
            .send(newVote)
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('data in incorrect format');
            });
    });


});


describe('/api/comments/:comment_id', () => {

    test('DELETE- status:204 - deletes the comment with the given comment_id', () => {
        return request(app)
            .delete('/api/comments/6')
            .expect(204)
            .then(() => {
                return request(app)
                    .get('/api/comments/6')
                    .expect(404)
                    .then(({ body }) => {
                        expect(body.message).toBe("invalid end point");//as it was deleted
                    });
            });
    });

    test('DELETE - status:404 - when passing a comment_id that doesnt exist in db', () => {
        return request(app)
            .delete('/api/comments/1000')
            .expect(404)
            .then(({ body }) => {
                expect(body.message).toBe('Comment not found');
            });
    });

    test('DELETE - status:400 - when passing an incorrect comment_id', () => {
        return request(app)
            .delete('/api/comments/banana')
            .expect(400)
            .then(({ body }) => {
                expect(body.message).toBe('invalid ID');
            });
    });
});



describe('/api/users', () => {
    test('GET-Status: 200 - responds with array of all users ', () => {
        return request(app).get("/api/users").expect(200).then(({ body }) => {


            expect(Array.isArray(body.users)).toBe(true)
            body.users.forEach((user) => {
                expect(user).toHaveProperty('username');
                expect(typeof user.username).toBe('string');

                expect(user).toHaveProperty('name');
                expect(typeof user.name).toBe('string');

                expect(user).toHaveProperty('avatar_url');
                expect(typeof user.avatar_url).toBe('string');

            })
        })
    });

})

// describe('/api/reviews', () => {
//     test('GET-Status: 200 - responds with array of all users ', () => {
//         return request(app).get("/api/reviews").expect(200).then(({ body }) => {


//             expect(Array.isArray(body.users)).toBe(true)
//             expect(body.reviews.length).toBeGreaterThan(0);

//         })
//     })
//     test('GET-status: 200 can be sort by valid colum specified to query', () => {
//         return request(app).get("/api/reviews?sort_by=").expect(200).then(({ body }) => {


//         })
//     });
// });







