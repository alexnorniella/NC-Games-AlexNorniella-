
const { selectCategories, selectAllReviews } = require('../models/categories.models')

const { selectCategories, selectReview } = require('../models/categories.models')



exports.getCategories = (req, res) => {

    return selectCategories().then((categories) => {
        res.status(200).send({ categories: categories })

    })

}

exports.getAllReviews = (req, res) => {
    selectAllReviews().then((reviews) => {
        res.status(200).send({ reviews: reviews })
    })



exports.getReview = (req, res, next) => {
    const { review_id } = req.params
    return selectReview(review_id).then((review) => {
        if (review) {
            res.status(200).send({ review: review })
        } else {
            return next({ status: 404, message: 'not found' })
        }
    })


}