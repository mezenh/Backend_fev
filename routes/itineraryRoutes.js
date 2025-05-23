const express = require('express');
const router = express.Router();
const { 
  createItinerary, 
  searchItineraries 
} = require('../controllers/itineraryController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createItinerary);
router.get('/search', searchItineraries);

module.exports = router;