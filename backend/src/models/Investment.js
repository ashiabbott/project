import mongoose from 'mongoose';

const InvestmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
    },
    assetType: {
      type: String,
      enum: ['stock', 'bond', 'crypto', 'real_estate', 'commodity', 'other'],
      required: true,
    },
    symbol: {
      type: String,
      uppercase: true,
      maxlength: [10, 'Symbol cannot exceed 10 characters'],
    },
    name: {
      type: String,
      required: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
    },
    averagePurchasePrice: {
      type: Number,
      required: true,
      min: [0, 'Purchase price cannot be negative'],
    },
    currentPrice: {
      type: Number,
      min: [0, 'Current price cannot be negative'],
    },
    totalValue: {
      type: Number,
      default: 0,
      min: [0, 'Total value cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Virtuals for financial calculations
InvestmentSchema.virtual('unrealizedGainLoss').get(function () {
  if (this.currentPrice) {
    const totalCost = this.quantity * this.averagePurchasePrice;
    const currentValue = this.quantity * this.currentPrice;
    return currentValue - totalCost;
  }
  return null;
});

// Middleware to update totalValue before saving
InvestmentSchema.pre('save', function (next) {
  if (this.currentPrice) {
    this.totalValue = this.quantity * this.currentPrice;
  }
  this.lastUpdated = Date.now();
  next();
});

export default mongoose.model('Investment', InvestmentSchema);
