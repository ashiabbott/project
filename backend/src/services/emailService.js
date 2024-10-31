const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

exports.sendBudgetAlert = async (userId, category, spent, limit) => {
  const user = await User.findById(userId);
  if (!user.notificationPreferences.budgetAlerts) return;

  const subject = `Budget Alert: ${category} limit reached`;
  const html = `
    <h1>Budget Alert</h1>
    <p>Hello ${user.name},</p>
    <p>You have reached ${Math.round((spent / limit) * 100)}% of your budget for ${category}.</p>
    <p>Spent: $${spent.toFixed(2)}</p>
    <p>Limit: $${limit.toFixed(2)}</p>
    <p>Please review your spending in this category.</p>
  `;
  await this.sendEmail(user.email, subject, html);
};

exports.sendGoalAchievement = async (userId, goal) => {
  const user = await User.findById(userId);
  if (!user.notificationPreferences.goalAchievements) return;

  const subject = `Congratulations! You've achieved your goal: ${goal.name}`;
  const html = `
    <h1>Goal Achieved!</h1>
    <p>Congratulations ${user.name}!</p>
    <p>You've successfully achieved your goal: ${goal.name}</p>
    <p>Target Amount: $${goal.targetAmount.toFixed(2)}</p>
    <p>Keep up the great work!</p>
  `;
  await this.sendEmail(user.email, subject, html);
};

exports.sendWeeklyReport = async (userId, reportData) => {
  const user = await User.findById(userId);
  if (!user.notificationPreferences.weeklyReport) return;

  const subject = 'Your Weekly Financial Report';
  const html = `
    <h1>Weekly Financial Report</h1>
    <p>Hello ${user.name},</p>
    <p>Here's a summary of your financial activity this week:</p>
    <ul>
      <li>Total Income: $${reportData.totalIncome.toFixed(2)}</li>
      <li>Total Expenses: $${reportData.totalExpenses.toFixed(2)}</li>
      <li>Top Expense Category: ${reportData.topExpenseCategory}</li>
      <li>Savings: $${reportData.savings.toFixed(2)}</li>
    </ul>
    <p>Log in to your account for more detailed information.</p>
  `;
  await this.sendEmail(user.email, subject, html);
};

exports.sendInvestmentAlert = async (userId, investment, change) => {
  const user = await User.findById(userId);
  if (!user.notificationPreferences.investmentAlerts) return;

  const subject = `Investment Alert: Significant change in ${investment.name}`;
  const html = `
    <h1>Investment Alert</h1>
    <p>Hello ${user.name},</p>
    <p>There has been a significant change in your investment: ${investment.name}</p>
    <p>Change: ${change > 0 ? '+' : ''}${change.toFixed(2)}%</p>
    <p>Please log in to your account to review and take any necessary actions.</p>
  `;
  await this.sendEmail(user.email, subject, html);
};
