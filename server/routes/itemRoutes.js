const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyReports,
  getItemMatches,
} = require('../controllers/itemController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Specific subroutes before parameterized :id route
router.get('/my-reports', protect, getMyReports);
router.get('/matches/:id', getItemMatches);

router
  .route('/')
  .get(getItems)
  .post(protect, upload.single('image'), createItem);

router
  .route('/:id')
  .get(getItemById)
  .put(protect, upload.single('image'), updateItem)
  .delete(protect, deleteItem);

module.exports = router;

