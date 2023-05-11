\c nc_games_test;
 SELECT 
    comments.comment_id,
    comments.votes,
    comments.created_at,
    comments.author,
    comments.body,
    comments.review_id
FROM 
    comments
WHERE 
review_id = 2
ORDER BY
    comments.created_at
DESC;

-- SELECT 
--     reviews.review_id, 
--     reviews.title as review_title, 
--     reviews.category as review_category,
--     reviews.owner as review_owner,
--     count(comments.review_id) as comment_count,
--     reviews.created_at
-- FROM 
--     reviews
-- LEFT JOIN
--     comments
-- ON
--     comments.review_id = reviews.review_id
-- GROUP BY
--     comments.review_id, reviews.review_id
-- ORDER BY
--     reviews.created_at
-- DESC;

-- SELECT 
--     reviews.review_id, 
--     reviews.title as review_title, 
--     reviews.category as review_category,
--     reviews.owner as review_owner
-- FROM 
--     reviews;

-- SELECT 
--     *
-- FROM 
--     comments;


