const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getUsers,
  toggleUserStatus,
  getAllClaims,
  reviewClaim,
  updateItemStatus,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/claims', getAllClaims);
router.put('/claims/:id/review', reviewClaim);
router.put('/items/:id/status', updateItemStatus);

module.exports = router;

