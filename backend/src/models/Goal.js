// src/models/Goal.js
import mongoose from 'mongoose';

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
  },
  targetAmount: {
    type: Number,
    required: true,
    min: [0, 'Target amount cannot be negative'],
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount cannot be negative'],
  },
  targetDate: {
    type: Date,
  },
  category: {
    type: String,
    trim: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

GoalSchema.index({ user: 1, title: 1 }, { unique: true });

export default mongoose.model('Goal', GoalSchema);
