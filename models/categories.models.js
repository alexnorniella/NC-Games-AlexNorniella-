const db = require("../db/connection")


exports.selectCategories = () => {
    return db.query(`
    SELECT * FROM categories;
    `).then((result) => {

        return result.rows;
    })
}

exports.selectAllReviews = () => {
    return db.query(`SELECT 
reviews.review_id, 
reviews.title,
reviews.review_img_url,
reviews.designer,
reviews.category,
reviews.owner,
reviews.votes,

CAST(count(comments.review_id)AS INT) as comment_count,
reviews.created_at
FROM 
reviews
LEFT JOIN
comments
ON
comments.review_id = reviews.review_id
GROUP BY
comments.review_id, reviews.review_id
ORDER BY
reviews.created_at
DESC;`).then((result) => {

        return result.rows;
    })


}

exports.selectReview = (review_id) => {
    return db.query(`SELECT * FROM reviews WHERE review_id = $1;
    `, [review_id]).then((review) => {
        return review.rows[0]
    })


}

exports.selectReviewWithComments = (review_id) => {
    if (!Number.isInteger(parseInt(review_id))) {
        return Promise.reject({ status: 400, message: "invalid ID" });
    }
    return db.query(` SELECT 
    comments.comment_id,
    comments.votes,
    comments.created_at,
    comments.author,
    comments.body,
    comments.review_id
FROM 
    comments
WHERE 
review_id = $1
ORDER BY
    comments.created_at
DESC;
`,


        [review_id]).then((review) => {
            return Promise.all([review.rows, exports.selectReview(review_id)])
        }).then(([rows, review]) => {


            if (!review) {
                return Promise.reject({ status: 404, message: 'not found' })
            } else {
                return rows;
            }
        })



}

exports.addComment = (newComment, review_id) => {
    if (!Number.isInteger(parseInt(review_id))) {
        return Promise.reject({ status: 400, message: "invalid ID" });
    }
    //needs to be an author that exists for happy path
    //need to handle if author doesnt exist
    //need to handle when review_id doesnt exist
    return db.query(`INSERT INTO comments(author, body, review_id) VALUES ($1, $2, $3) RETURNING *;`, [newComment.username, newComment.body, review_id]).then((result) => {
        return result.rows[0]
    })

}


exports.updateReviewVotes = (review_id, inc_votes) => {
    if (!Number.isInteger(parseInt(review_id))) {
        return Promise.reject({ status: 400, message: "invalid ID" });
    }

    return db
        .query(
            `
        UPDATE reviews
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *;
        `,
            [inc_votes, review_id]
        )
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, message: "Review not found" });
            }
            return result.rows[0];
        });
};

exports.selectAllUsers = () => {
    return db.query(`SELECT * FROM users;
    `).then((result) => {

        return result.rows;
    })
}
