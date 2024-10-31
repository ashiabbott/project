const mongoose = require('mongoose');
require('dotenv').config();
const seedAchievements = require('./src/seeds/achievementSeeder');

const connectDB = require('./src/database');

const seedDatabase = async () => {
  await connectDB();
  await seedAchievements();
};

seedDatabase();
