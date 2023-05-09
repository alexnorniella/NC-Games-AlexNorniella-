const { selectCategories } = require('../models/categories.models')


exports.getCategories = (req, res) => {
    const sortBy = req.query.sort_by

    selectCategories(sortBy).then((categories) => {
        res.status(200).send({ categories: categories })

    })

}