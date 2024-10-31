import mongoose from 'mongoose';

const RewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a reward title'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    requiredPoints: {
      type: Number,
      required: [true, 'Please specify the number of points required to redeem this reward'],
      min: [0, 'Required points cannot be negative'],
    },
    quantityAvailable: {
      type: Number,
      default: null,
      min: [0, 'Quantity cannot be negative'],
    },
    // Additional fields for reward details
    image: {
      type: String, // URL or path to the reward image
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for checking availability
RewardSchema.virtual('isAvailable').get(function () {
  return this.quantityAvailable === null || this.quantityAvailable > 0;
});

// Export the model
export default mongoose.model('Reward', RewardSchema);

