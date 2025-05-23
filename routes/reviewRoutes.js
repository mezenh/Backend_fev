const express = require('express');
const router = express.Router();
const { 
  createReview, 
  getDestinationReviews 
} = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createReview);
router.get('/destination/:id', getDestinationReviews);

module.exports = router;