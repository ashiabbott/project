import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

// Define User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationTokenExpire: Date,
    passwordResetToken: String,
    passwordResetTokenExpire: Date,
    isMfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaSecret: {
      type: String,
      select: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    // Additional fields for advanced features
    profilePicture: {
      type: String,
      default: 'default-profile.png',
    },
    subscriptions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient querying
UserSchema.index({ email: 1 });

// Encrypt password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  // Hash the password
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Generate and hash email verification token
UserSchema.methods.generateEmailVerificationToken = function () {
  // Generate token
  const verificationToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to field
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  // Set expire date
  this.emailVerificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return verificationToken;
};

// Generate and hash password reset token
UserSchema.methods.generatePasswordResetToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to field
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire date
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Match user-entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Cascade delete related data when a user is deleted
UserSchema.pre('remove', async function (next) {
  console.log(`Deleting all data related to user ${this._id}`);
  await Promise.all([
    this.model('Transaction').deleteMany({ user: this._id }),
    this.model('Account').deleteMany({ user: this._id }),
    this.model('Investment').deleteMany({ user: this._id }),
    this.model('Goal').deleteMany({ user: this._id }),
    this.model('Notification').deleteMany({ user: this._id }),
    // Add more models as needed
  ]);
  next();
});

// Virtuals for populating related data
UserSchema.virtual('transactions', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

UserSchema.virtual('accounts', {
  ref: 'Account',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
});

export default mongoose.model('User', UserSchema);
