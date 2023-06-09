
const { selectCategories, selectReview, selectAllReviews, selectReviewWithComments, addComment, updateReviewVotes, removeComment, selectAllUsers } = require('../models/categories.models')

const endpoints = require('../endpoints.json')

exports.getAPI= (req,res,nex)=>{
    res.status(200).send(endpoints)
}

exports.getCategories = (req, res) => {

    return selectCategories().then((categories) => {
        res.status(200).send({ categories: categories })

    }).catch((err) => {
        next(err)
    })

}

exports.getAllReviews = (req, res, next) => {
    const { sort_by, order } = req.query
    // console.log(sort_by, order)
    selectAllReviews(sort_by, order).then((reviews) => {
        res.status(200).send({ reviews: reviews })
    }).catch((err) => {
        next(err)
    })
}


exports.getReview = (req, res, next) => {
    const { review_id } = req.params
    return selectReview(review_id).then((review) => {
        if (review) {
            res.status(200).send({ review: review })
        } else {
            return next({ status: 404, message: 'not found' })
        }
    }).catch((err) => {
        next(err)
    })


}

exports.getReviewWithComments = (req, res, next) => {
    const { review_id } = req.params

    return selectReviewWithComments(review_id).then((comments) => {
        if (comments) {
            res.status(200).send({ comments: comments })
        }
    }).catch((err) => {
        next(err)
    })

}

exports.postComment = (req, res, next) => {
    const newComment = req.body;
    const { review_id } = req.params

    return addComment(newComment, review_id).then((newComment) => {
        return res.status(201).send({ newComment })
    }).catch((err) => {
        next(err)
    })

}

exports.patchReview = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;

    return updateReviewVotes(review_id, inc_votes)
        .then((updatedReview) => {
            res.status(200).send({ updatedReview });
        })
        .catch((err) => {
            next(err)
        });
};

exports.getAllUsers = (req, res) => {
    selectAllUsers().then((users) => {
        res.status(200).send({ users: users })
    }).catch((err) => {
        next(err)
    })
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    return removeComment(comment_id)
        .then(() => {
            res.sendStatus(204);
        })
        .catch((err) => {
            next(err);
        });
};

