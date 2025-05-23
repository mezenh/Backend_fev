const Review = require('../models/reviewSchema');

// @desc    Créer un avis
// @route   POST /api/reviews
// @access  Privé
exports.createReview = async (req, res) => {
  try {
    const review = await Review.create({
      ...req.body,
      user: req.user.id
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc    Obtenir les avis d'une destination
// @route   GET /api/reviews/destination/:id
// @access  Public
exports.getDestinationReviews = async (req, res) => {
  const reviews = await Review.find({ 
    destination: req.params.id 
  }).populate('user', 'username user_image');
  res.json(reviews);
};