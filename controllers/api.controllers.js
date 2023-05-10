const { selectCategories, selectAllReviews } = require('../models/categories.models')


exports.getCategories = (req, res) => {

    selectCategories().then((categories) => {
        res.status(200).send({ categories: categories })

    })

}
exports.getAllReviews = (req, res) => {
    selectAllReviews().then((reviews) => {
        res.status(200).send({ reviews: reviews })
    })


}