import mongoose from 'mongoose';

const BudgetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    year: {
      type: Number,
      required: true,
    },
    categories: [
      {
        category: {
          type: String,
          required: true,
        },
        allocatedAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        spentAmount: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    totalAllocated: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Budget', BudgetSchema);
