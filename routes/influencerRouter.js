const express = require('express');
const router = express.Router();
const influencerController = require('../controllers/influencerController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Routes publiques
router.get('/', influencerController.getAllInfluencers);       // Ligne 7
router.get('/:id', influencerController.getInfluencerById);   // Ligne 8

// Routes protégées
router.use(protect);

router.post('/', admin, influencerController.createInfluencer);
router.put('/:id', influencerController.updateInfluencer);
router.delete('/:id', admin, influencerController.deleteInfluencer);

// Routes spéciales
router.get('/region/:region', influencerController.getInfluencersByRegion);
router.post('/:id/add-destination', influencerController.addVisitedDestination);

module.exports = router;