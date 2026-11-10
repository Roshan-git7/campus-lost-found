const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');
const Notification = require('../models/Notification');

// @desc    Get admin dashboard metrics & analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
exports.getAdminDashboard = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalLost,
      totalFound,
      totalPendingClaims,
      totalReturned,
      recentReports,
      categoryStats,
      recentClaims,
    ] = await Promise.all([
      User.countDocuments(),
      Item.countDocuments({ type: 'Lost' }),
      Item.countDocuments({ type: 'Found' }),
      Claim.countDocuments({ status: 'Pending' }),
      Item.countDocuments({ status: 'Returned' }),
      Item.find()
        .populate('reportedBy', 'name email role')
        .sort({ createdAt: -1 })
        .limit(6),
      Item.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            lostCount: {
              $sum: { $cond: [{ $eq: ['$type', 'Lost'] }, 1, 0] },
            },
            foundCount: {
              $sum: { $cond: [{ $eq: ['$type', 'Found'] }, 1, 0] },
            },
          },
        },
      ]),
      Claim.find()
        .populate('itemId', 'title type category')
        .populate('claimantId', 'name email uid')
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const totalItems = totalLost + totalFound;
    const recoveryRate =
      totalItems > 0 ? Math.round((totalReturned / totalItems) * 100) : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalLost,
          totalFound,
          totalItems,
          totalPendingClaims,
          totalReturned,
          recoveryRate,
        },
        categoryStats,
        recentReports,
        recentClaims,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search and pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
exports.getUsers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    const query = {};

    if (role && role !== 'All') {
      query.role = role;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { uid: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user account activation status
// @route   PUT /api/admin/users/:id/toggle-status
// @access  Private (Admin only)
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    if (user.role === 'admin' && user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own administrator account.',
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User account has been ${user.isActive ? 'activated' : 'deactivated'} successfully.`,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all claims for admin review
// @route   GET /api/admin/claims
// @access  Private (Admin only)
exports.getAllClaims = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const claims = await Claim.find(query)
      .populate('itemId')
      .populate('claimantId', 'name email role uid')
      .populate('reviewedBy', 'name email')
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

// @desc    Review claim (Approve or Reject)
// @route   PUT /api/admin/claims/:id/review
// @access  Private (Admin only)
exports.reviewClaim = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either 'Approved' or 'Rejected'.",
      });
    }

    const claim = await Claim.findById(req.params.id).populate('itemId');

    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found.',
      });
    }

    claim.status = status;
    claim.adminNotes = adminNotes || '';
    claim.reviewedBy = req.user._id;
    claim.reviewedAt = new Date();
    await claim.save();

    const item = await Item.findById(claim.itemId._id);

    if (status === 'Approved') {
      // Mark item status as Claimed and assign claimedBy
      item.status = 'Claimed';
      item.claimedBy = claim.claimantId;
      await item.save();

      // Reject any other pending claims on this item
      await Claim.updateMany(
        {
          itemId: item._id,
          _id: { $ne: claim._id },
          status: 'Pending',
        },
        {
          status: 'Rejected',
          adminNotes: 'Another verified claim was approved by administration.',
          reviewedBy: req.user._id,
          reviewedAt: new Date(),
        }
      );

      // Notify the approved claimant
      await Notification.create({
        recipient: claim.claimantId,
        title: 'Claim Approved! 🎉',
        message: `Your ownership claim for "${item.title}" was approved! Please visit Campus Security Office with your ID to collect your item.`,
        type: 'claim_approved',
        relatedItem: item._id,
      });

      // Notify the item reporter
      await Notification.create({
        recipient: item.reportedBy,
        title: 'Item Claim Verified',
        message: `An ownership claim for your reported item "${item.title}" has been verified and approved.`,
        type: 'claim_approved',
        relatedItem: item._id,
      });
    } else {
      // Claim Rejected
      // Notify claimant
      await Notification.create({
        recipient: claim.claimantId,
        title: 'Claim Verification Update',
        message: `Your claim for "${item.title}" could not be verified. Note: ${adminNotes || 'Insufficient proof provided.'}`,
        type: 'claim_rejected',
        relatedItem: item._id,
      });

      // Check if there are other pending claims
      const remainingPending = await Claim.findOne({
        itemId: item._id,
        status: 'Pending',
      });

      if (!remainingPending && item.status === 'Claim Pending') {
        item.status = 'Open';
        await item.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Claim has been ${status.toLowerCase()} successfully.`,
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item status or mark returned
// @route   PUT /api/admin/items/:id/status
// @access  Private (Admin only)
exports.updateItemStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Open', 'Claim Pending', 'Claimed', 'Returned', 'Closed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid item status value.',
      });
    }

    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found.',
      });
    }

    item.status = status;
    await item.save();

    // If marked as Returned, notify reporter and claimant
    if (status === 'Returned') {
      await Notification.create({
        recipient: item.reportedBy,
        title: 'Item Returned Successfully! 📦',
        message: `The item "${item.title}" has been safely returned to its owner. Thank you for making our campus better!`,
        type: 'item_returned',
        relatedItem: item._id,
      });

      if (item.claimedBy) {
        await Notification.create({
          recipient: item.claimedBy,
          title: 'Item Handover Complete! 📦',
          message: `The handover for "${item.title}" has been recorded as complete.`,
          type: 'item_returned',
          relatedItem: item._id,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Item status updated to ${status}.`,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

