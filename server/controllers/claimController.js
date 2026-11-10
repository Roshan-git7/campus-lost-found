const Claim = require('../models/Claim');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Submit an ownership claim for an item
// @route   POST /api/claims
// @access  Private
exports.submitClaim = async (req, res, next) => {
  try {
    const { itemId, proofOfOwnership, additionalDescription } = req.body;

    if (!itemId || !proofOfOwnership) {
      return res.status(400).json({
        success: false,
        message: 'Item ID and Proof of Ownership are required.',
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    if (item.status === 'Returned' || item.status === 'Closed') {
      return res.status(400).json({
        success: false,
        message: 'This item has already been marked as returned or closed.',
      });
    }

    // Prevent duplicate pending claims for the same user and item
    const existingClaim = await Claim.findOne({
      itemId,
      claimantId: req.user._id,
      status: { $in: ['Pending', 'Approved'] },
    });

    if (existingClaim) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an active claim for this item.',
      });
    }

    let supportingImage = req.body.supportingImage || '';
    if (req.file) {
      supportingImage = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    const claim = await Claim.create({
      itemId,
      claimantId: req.user._id,
      proofOfOwnership,
      additionalDescription: additionalDescription || '',
      supportingImage,
      status: 'Pending',
    });

    // Update item status to 'Claim Pending'
    item.status = 'Claim Pending';
    await item.save();

    // Notify item reporter
    if (item.reportedBy.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: item.reportedBy,
        title: 'New Ownership Claim Submitted',
        message: `A student has submitted an ownership claim for your reported item: "${item.title}".`,
        type: 'claim_submitted',
        relatedItem: item._id,
      });
    }

    // Notify administrators
    const admins = await User.find({ role: 'admin' });
    for (const admin of admins) {
      await Notification.create({
        recipient: admin._id,
        title: 'New Claim Pending Verification',
        message: `New claim submitted for "${item.title}" by ${req.user.name}.`,
        type: 'claim_submitted',
        relatedItem: item._id,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Claim submitted successfully. Campus administration will verify your evidence.',
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims submitted by the logged-in user
// @route   GET /api/claims/my-claims
// @access  Private
exports.getMyClaims = async (req, res, next) => {
  try {
    const claims = await Claim.find({ claimantId: req.user._id })
      .populate('itemId', 'title category type location date status imageUrl')
      .populate('reviewedBy', 'name role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: claims.length,
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get claim by ID
// @route   GET /api/claims/:id
// @access  Private (Claimant or Admin)
exports.getClaimById = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id)
      .populate('itemId')
      .populate('claimantId', 'name email role uid')
      .populate('reviewedBy', 'name role');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found.',
      });
    }

    if (
      claim.claimantId._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this claim.',
      });
    }

    res.status(200).json({
      success: true,
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a pending claim
// @route   PUT /api/claims/:id/cancel
// @access  Private (Claimant only)
exports.cancelClaim = async (req, res, next) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found.',
      });
    }

    if (claim.claimantId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only cancel your own claims.',
      });
    }

    if (claim.status !== 'Pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel claim with status '${claim.status}'.`,
      });
    }

    claim.status = 'Cancelled';
    await claim.save();

    // Check if there are other pending claims on this item
    const otherPending = await Claim.findOne({
      itemId: claim.itemId,
      status: 'Pending',
    });

    if (!otherPending) {
      await Item.findByIdAndUpdate(claim.itemId, { status: 'Open' });
    }

    res.status(200).json({
      success: true,
      message: 'Claim cancelled successfully.',
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

