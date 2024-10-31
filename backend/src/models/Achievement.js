import mongoose from 'mongoose';

const AchievementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the achievement'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    criteria: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Please specify criteria for the achievement'],
    },
    icon: {
      type: String, // URL or path to the icon image
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

export default mongoose.model('Achievement', AchievementSchema);
