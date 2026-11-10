const Item = require('../models/Item');
const Claim = require('../models/Claim');
const Notification = require('../models/Notification');
const { findPotentialMatches } = require('../services/matchingService');

// @desc    Create a new lost/found item report
// @route   POST /api/items
// @access  Private
exports.createItem = async (req, res, next) => {
  try {
    const { title, description, category, type, date, location } = req.body;

    if (!title || !description || !category || !type || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, category, type, date, location',
      });
    }

    let imageUrl = req.body.imageUrl || '';
    if (req.file) {
      // If multer with Cloudinary is used, path contains the secure url
      // If diskStorage is used, construct relative url
      imageUrl = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    const item = await Item.create({
      title,
      description,
      category,
      type,
      date,
      location,
      imageUrl,
      reportedBy: req.user._id,
    });

    // Check for smart matches and notify owners if strong match (score >= 50)
    try {
      const matches = await findPotentialMatches(item, 50);
      if (matches.length > 0) {
        // Send notification to current reporter
        await Notification.create({
          recipient: req.user._id,
          title: 'Potential Match Found!',
          message: `We identified ${matches.length} potential matching ${item.type === 'Lost' ? 'found' : 'lost'} items for "${item.title}".`,
          type: 'match_found',
          relatedItem: item._id,
        });

        // Also notify the reporter of the top match
        const topMatch = matches[0].item;
        if (topMatch.reportedBy && topMatch.reportedBy._id) {
          await Notification.create({
            recipient: topMatch.reportedBy._id,
            title: 'Potential Match Found!',
            message: `A new ${item.type.toLowerCase()} item ("${item.title}") might match your reported item "${topMatch.title}".`,
            type: 'match_found',
            relatedItem: topMatch._id,
          });
        }
      }
    } catch (matchErr) {
      console.warn('Smart match notification error (non-fatal):', matchErr.message);
    }

    res.status(201).json({
      success: true,
      message: `${type} item reported successfully`,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all items with search, filters, pagination
// @route   GET /api/items
// @access  Public
exports.getItems = async (req, res, next) => {
  try {
    const {
      search,
      category,
      type,
      location,
      startDate,
      endDate,
      status,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};

    // Filter by type (Lost / Found)
    if (type && ['Lost', 'Found'].includes(type)) {
      query.type = type;
    }

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Filter by status (Default to Open and Claim Pending unless specified)
    if (status && status !== 'All') {
      query.status = status;
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Keyword Search
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { location: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Sorting
    let sortQuery = { createdAt: -1 }; // default newest first
    if (sort === 'oldest') {
      sortQuery = { createdAt: 1 };
    } else if (sort === 'date_desc') {
      sortQuery = { date: -1 };
    } else if (sort === 'date_asc') {
      sortQuery = { date: 1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      Item.find(query)
        .populate('reportedBy', 'name role')
        .sort(sortQuery)
        .skip(skip)
        .limit(limitNum),
      Item.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item details
// @route   GET /api/items/:id
// @access  Public
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('reportedBy', 'name role uid')
      .populate('claimedBy', 'name role');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item report
// @route   PUT /api/items/:id
// @access  Private (Owner or Admin)
exports.updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    // Authorization: owner or admin
    if (
      item.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this report',
      });
    }

    const updates = { ...req.body };

    if (req.file) {
      updates.imageUrl = req.file.path.startsWith('http')
        ? req.file.path
        : `/uploads/${req.file.filename}`;
    }

    // Non-admin users cannot arbitrary modify item ownership
    delete updates.reportedBy;
    delete updates.claimedBy;

    item = await Item.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Item report updated successfully',
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item report
// @route   DELETE /api/items/:id
// @access  Private (Owner or Admin)
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    if (
      item.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this report',
      });
    }

    await Item.findByIdAndDelete(req.params.id);
    // Remove related claims
    await Claim.deleteMany({ itemId: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Item report and associated claims deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's reported items
// @route   GET /api/items/my-reports
// @access  Private
exports.getMyReports = async (req, res, next) => {
  try {
    const items = await Item.find({ reportedBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Find smart matches for a given item
// @route   GET /api/items/matches/:id
// @access  Public
exports.getItemMatches = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found',
      });
    }

    const matches = await findPotentialMatches(item, 20);

    res.status(200).json({
      success: true,
      data: {
        item: {
          _id: item._id,
          title: item.title,
          category: item.category,
          type: item.type,
          location: item.location,
          date: item.date,
        },
        matches,
      },
    });
  } catch (error) {
    next(error);
  }
};

