const express = require('express')
const app = express()
const { getCategories, getAllReviews, getReview, getReviewWithComments } = require("./controllers/api.controllers")

app.use(express.json())

app.get('/api/categories', getCategories)

app.get('/api/reviews', getAllReviews)

app.get("/api/reviews/:review_id", getReview)

app.get("/api/reviews/:review_id/comments", getReviewWithComments)


app.all('*', (req, res) => {
    res.status(404).send({ message: "invalid end point" })

})


app.use((error, req, res, next) => {
    console.log(error, 'error')
    res.status(error.status).send({ message: error.message })
})

module.exports = app

