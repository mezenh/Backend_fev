const express = require('express');
const router = express.Router();
const {
  createEvent,
  getEvents,
  subscribeToEvent,
  getEventsByRegion,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(getEvents)
  .post(protect, admin, createEvent);

router.route('/:id')
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

router.route('/:id/subscribe')
  .post(protect, subscribeToEvent);

router.route('/region/:region')
  .get(getEventsByRegion);

module.exports = router;