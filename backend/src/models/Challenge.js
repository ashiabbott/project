// src/models/Challenge.js
import mongoose from 'mongoose';

const ChallengeSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a title for the challenge'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
    },
    goal: {
      type: Number,
      required: [true, 'Please specify a goal amount'],
      min: [0, 'Goal amount cannot be negative'],
    },
    rules: {
      type: String,
      maxlength: [2000, 'Rules cannot be more than 2000 characters'],
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model('Challenge', ChallengeSchema);
