const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an item title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'Electronics',
        'Documents / ID Cards',
        'Wallets',
        'Keys',
        'Bags',
        'Books',
        'Clothing',
        'Accessories',
        'Other',
      ],
    },
    type: {
      type: String,
      required: [true, 'Please specify if item is Lost or Found'],
      enum: ['Lost', 'Found'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide the date when lost/found'],
    },
    location: {
      type: String,
      required: [true, 'Please specify the campus location'],
      trim: true,
      maxlength: [150, 'Location cannot exceed 150 characters'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Open', 'Claim Pending', 'Claimed', 'Returned', 'Closed'],
      default: 'Open',
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast search and filtering
itemSchema.index({ title: 'text', description: 'text', location: 'text' });
itemSchema.index({ type: 1, category: 1, status: 1 });
itemSchema.index({ reportedBy: 1 });
itemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Item', itemSchema);

