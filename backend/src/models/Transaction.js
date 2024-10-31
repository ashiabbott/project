import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    account: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'transfer'],
      required: [true, 'Please specify the transaction type'],
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the transaction amount'],
      min: [0, 'Amount cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
      uppercase: true,
      minlength: 3,
      maxlength: 3,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      maxlength: [50, 'Category cannot exceed 50 characters'],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    // Advanced features
    tags: [
      {
        type: String,
        maxlength: [30, 'Tag cannot exceed 30 characters'],
      },
    ],
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurrenceInterval: {
      type: String,
      enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly'],
    },
    endDate: {
      type: Date,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: Date,
      },
    ],
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: [Number], // [longitude, latitude]
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance optimization
TransactionSchema.index({ user: 1, date: -1 });
TransactionSchema.index({ location: '2dsphere' });

// Middleware to update account balance after transaction is saved
TransactionSchema.post('save', async function (doc, next) {
  const Account = mongoose.model('Account');

  try {
    const account = await Account.findById(doc.account);

    if (doc.type === 'income') {
      account.balance += doc.amount;
    } else if (doc.type === 'expense') {
      account.balance -= doc.amount;
    } else if (doc.type === 'transfer') {
      // Handle transfer logic
      // Assume transfer has a 'toAccount' field
      const toAccount = await Account.findById(doc.toAccount);
      account.balance -= doc.amount;
      toAccount.balance += doc.amount;
      await toAccount.save();
    }

    await account.save();
    next();
  } catch (error) {
    next(error);
  }
});

// Middleware to reverse account balance when transaction is removed
TransactionSchema.pre('remove', async function (next) {
  const Account = mongoose.model('Account');

  try {
    const account = await Account.findById(this.account);

    if (this.type === 'income') {
      account.balance -= this.amount;
    } else if (this.type === 'expense') {
      account.balance += this.amount;
    } else if (this.type === 'transfer') {
      // Handle transfer reversal
      const toAccount = await Account.findById(this.toAccount);
      account.balance += this.amount;
      toAccount.balance -= this.amount;
      await toAccount.save();
    }

    await account.save();
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Transaction', TransactionSchema);
