const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin, isOwnerOrAdmin } = require('../middlewares/roleMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(protect);

router.get('/me', userController.getMe);
router.put('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

// Admin routes
router.use(isAdmin);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.put('/:id', isOwnerOrAdmin, userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/ban', userController.toggleBan);

module.exports = router;