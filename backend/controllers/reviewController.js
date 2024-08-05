const Review = require('../models/Review');

exports.leaveReview = async (req, res) => {
    const { comment, client, company, rating, orderNumber } = req.body;
    const review = new Review({
        client: client,
        comment: comment,
        company: company,
        rating: rating,
        orderNumber: orderNumber
    });
    try {
        const savedReview = await review.save()

        return res.status(200).send({ review: savedReview, message: 'Review Posted successfully' });
    } catch (err) {
        return res.status(400).send({ message: err.message });
    }
};
