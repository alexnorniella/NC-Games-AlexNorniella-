const express = require('express')
const app = express()
const { getCategories, getAllReviews, getReview, getReviewWithComments, postComment, patchReview,deleteComment} = require("./controllers/api.controllers")

app.use(express.json())

app.get('/api/categories', getCategories)

app.get('/api/reviews', getAllReviews)

app.get("/api/reviews/:review_id", getReview)

app.get("/api/reviews/:review_id/comments", getReviewWithComments)

app.post("/api/reviews/:review_id/comments", postComment)


app.patch('/api/reviews/:review_id', patchReview)

app.delete('/api/comments/:comment_id', deleteComment )

app.all('*', (req, res) => {
    res.status(404).send({ message: "invalid end point" })

})


app.use((error, req, res, next) => {
    //database errors have codes on...
    if (error.code && error.code === '23503') {
        return res.status(404).send({ message: 'not found' })
    }
    if (error.code && error.code === '23502') {
        //handle when the user/author doesnt exist...
        return res.status(400).send({ message: 'missing required information' })
    }
    if (error.code && error.code === '22P02') {
        //handle when the user/author doesnt exist...
        return res.status(400).send({ message: 'data in incorrect format' })
    }
    if (error.status) {
        return res.status(error.status).send({ message: error.message })
    }
    console.log('uncaught error', error)
})

module.exports = app

