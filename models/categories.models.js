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