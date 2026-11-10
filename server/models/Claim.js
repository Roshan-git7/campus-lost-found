const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: [true, 'Item reference is required'],
    },
    claimantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Claimant reference is required'],
    },
    proofOfOwnership: {
      type: String,
      required: [true, 'Please provide detailed proof of ownership'],
      trim: true,
      maxlength: [1000, 'Proof cannot exceed 1000 characters'],
    },
    additionalDescription: {
      type: String,
      trim: true,
      maxlength: [1000, 'Additional description cannot exceed 1000 characters'],
      default: '',
    },
    supportingImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
claimSchema.index({ itemId: 1, claimantId: 1 });
claimSchema.index({ claimantId: 1 });
claimSchema.index({ status: 1 });

module.exports = mongoose.model('Claim', claimSchema);

