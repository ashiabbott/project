import mongoose from 'mongoose';

const UserAchievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  achievement: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement',
    required: true,
  },
  awardedAt: {
    type: Date,
    default: Date.now,
  },
});

UserAchievementSchema.index({ user: 1, achievement: 1 }, { unique: true });

export default mongoose.model('UserAchievement', UserAchievementSchema);
