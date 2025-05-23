const Itinerary = require('../models/itinerarySchema');

// @desc    Créer un itinéraire
// @route   POST /api/itineraries
// @access  Privé
exports.createItinerary = async (req, res) => {
  const itinerary = await Itinerary.create({
    ...req.body,
    user: req.user.id
  });
  res.status(201).json(itinerary);
};

// @desc    Rechercher des itinéraires publics
// @route   GET /api/itineraries/search?q=...
// @access  Public
exports.searchItineraries = async (req, res) => {
  const itineraries = await Itinerary.find(
    { 
      $text: { $search: req.query.q },
      isPublic: true 
    },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
  
  res.json(itineraries);
};