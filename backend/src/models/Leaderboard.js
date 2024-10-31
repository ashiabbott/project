import mongoose from 'mongoose';

const { Schema } = mongoose;

const leaderboardSchema = new Schema(
  {
    challenge: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    rankings: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        score: {
          type: Number,
          default: 0,
          min: 0,
        },
      },
    ],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);

export default Leaderboard;
