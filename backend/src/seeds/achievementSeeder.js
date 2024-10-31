const mongoose = require('mongoose');
const Achievement = require('../models/Achievement');

const achievements = [
  {
    code: 'first_transaction',
    name: 'First Transaction',
    description: 'You have recorded your first transaction!',
  },
  {
    code: 'save_1000',
    name: 'Saved $1,000',
    description: 'You have saved $1,000 in total income!',
  },
  // Add more achievements here...
];

const seedAchievements = async () => {
  try {
    await Achievement.deleteMany({});
    await Achievement.insertMany(achievements);
    console.log('Achievements seeded successfully.');
    process.exit();
  } catch (err) {
    console.error('Error seeding achievements:', err);
    process.exit(1);
  }
};

module.exports = seedAchievements;
