const express = require('express');
const router = express.Router();
const {
  submitClaim,
  getMyClaims,
  getClaimById,
  cancelClaim,
} = require('../controllers/claimController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.post('/', upload.single('supportingImage'), submitClaim);
router.get('/my-claims', getMyClaims);
router.get('/:id', getClaimById);
router.put('/:id/cancel', cancelClaim);

module.exports = router;

