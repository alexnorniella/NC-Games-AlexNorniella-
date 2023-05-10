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
            console.log(review)

            if (!review) {
                return Promise.reject({ status: 404, message: 'not found' })
            } else {
                return rows;
            }
        })



}
