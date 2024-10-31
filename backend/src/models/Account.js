// src/models/Account.js
import mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    institutionName: {
      type: String,
      required: [true, 'Please provide the institution name'],
      maxlength: [100, 'Institution name cannot exceed 100 characters'],
    },
    accountType: {
      type: String,
      enum: ['checking', 'savings', 'credit', 'loan', 'investment', 'cash', 'mortgage'],
      required: [true, 'Please specify the account type'],
    },
    accountNumber: {
      type: String,
      required: [true, 'Please provide the account number'],
      unique: true,
      minlength: [4, 'Account number must be at least 4 characters'],
      maxlength: [20, 'Account number cannot exceed 20 characters'],
    },
    nickname: {
      type: String,
      maxlength: [50, 'Nickname cannot exceed 50 characters'],
    },
    balance: {
      type: Number,
      default: 0.0,
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Advanced features
    linkedPlaidAccountId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    accountMeta: {
      interestRate: {
        type: Number,
        min: [0, 'Interest rate cannot be negative'],
      },
      creditLimit: {
        type: Number,
        min: [0, 'Credit limit cannot be negative'],
      },
      maturityDate: {
        type: Date,
      },
      minimumPayment: {
        type: Number,
        min: [0, 'Minimum payment cannot be negative'],
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance optimization
AccountSchema.index({ user: 1, accountType: 1 });
AccountSchema.index({ accountNumber: 1 });

// Middleware to cascade delete related transactions when an account is deleted
AccountSchema.pre('remove', async function (next) {
  await this.model('Transaction').deleteMany({ account: this._id });
  next();
});

// Virtual for calculating available credit (for credit accounts)
AccountSchema.virtual('availableCredit').get(function () {
  if (this.accountType === 'credit' && this.accountMeta.creditLimit) {
    return this.accountMeta.creditLimit - this.balance;
  }
  return null;
});

export default mongoose.model('Account', AccountSchema);
