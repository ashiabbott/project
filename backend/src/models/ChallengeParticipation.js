// src/models/ChallengeParticipation.js
import mongoose from 'mongoose';

const ChallengeParticipationSchema = new mongoose.Schema(
  {
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: [0, 'Progress cannot be negative'],
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Unique participation per user per challenge
ChallengeParticipationSchema.index({ challenge: 1, user: 1 }, { unique: true });

export default mongoose.model('ChallengeParticipation', ChallengeParticipationSchema);
