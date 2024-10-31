import Investment from '../models/Investment.js';
import User from '../models/User.js';
import axios from 'axios';
import { validationResult } from 'express-validator';
import { updateUserPortfolio } from '../services/portfolioService.js';
import { checkAchievements } from '../services/gamificationService.js';

/**
 * @desc    Get all investments for the authenticated user
 * @route   GET /api/investments
 * @access  Private
 */
export const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id }).lean();

    res.status(200).json({ success: true, data: investments });
  } catch (error) {
    console.error('Error fetching investments:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get a single investment by ID
 * @route   GET /api/investments/:id
 * @access  Private
 */
export const getInvestmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const investment = await Investment.findOne({
      _id: id,
      user: req.user.id,
    }).lean();

    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }

    res.status(200).json({ success: true, data: investment });
  } catch (error) {
    console.error('Error fetching investment:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create a new investment
 * @route   POST /api/investments
 * @access  Private
 */
export const createInvestment = async (req, res) => {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {
    assetType,
    symbol,
    name,
    quantity,
    averagePurchasePrice,
    purchaseDate,
    notes,
  } = req.body;

  try {
    // Fetch current price using an external API (e.g., Finnhub)
    const currentPrice = await fetchCurrentPrice(symbol);

    const investment = new Investment({
      user: req.user.id,
      assetType,
      symbol,
      name,
      quantity,
      averagePurchasePrice,
      currentPrice,
      purchaseDate,
      notes,
    });

    await investment.save();

    // Update user's portfolio summary
    await updateUserPortfolio(req.user.id);

    // Check for achievements
    await checkAchievements(req.user.id);

    res.status(201).json({ success: true, data: investment });
  } catch (error) {
    console.error('Error creating investment:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update an existing investment
 * @route   PUT /api/investments/:id
 * @access  Private
 */
export const updateInvestment = async (req, res) => {
  const { id } = req.params;
  const {
    assetType,
    symbol,
    name,
    quantity,
    averagePurchasePrice,
    purchaseDate,
    notes,
  } = req.body;

  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let investment = await Investment.findOne({ _id: id, user: req.user.id });

    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }

    // Update fields
    investment.assetType = assetType || investment.assetType;
    investment.symbol = symbol || investment.symbol;
    investment.name = name || investment.name;
    investment.quantity = quantity || investment.quantity;
    investment.averagePurchasePrice = averagePurchasePrice || investment.averagePurchasePrice;
    investment.purchaseDate = purchaseDate || investment.purchaseDate;
    investment.notes = notes || investment.notes;

    // Fetch current price if symbol has changed
    if (symbol) {
      investment.currentPrice = await fetchCurrentPrice(symbol);
    }

    await investment.save();

    // Update user's portfolio summary
    await updateUserPortfolio(req.user.id);

    res.status(200).json({ success: true, data: investment });
  } catch (error) {
    console.error('Error updating investment:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete an investment
 * @route   DELETE /api/investments/:id
 * @access  Private
 */
export const deleteInvestment = async (req, res) => {
  const { id } = req.params;

  try {
    const investment = await Investment.findOne({ _id: id, user: req.user.id });

    if (!investment) {
      return res.status(404).json({ success: false, message: 'Investment not found' });
    }

    await investment.remove();

    // Update user's portfolio summary
    await updateUserPortfolio(req.user.id);

    res.status(200).json({ success: true, message: 'Investment deleted' });
  } catch (error) {
    console.error('Error deleting investment:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Refresh current price of all investments for the user
 * @route   PUT /api/investments/refresh
 * @access  Private
 */
export const refreshInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id });

    for (const investment of investments) {
      investment.currentPrice = await fetchCurrentPrice(investment.symbol);
      await investment.save();
    }

    // Update user's portfolio summary
    await updateUserPortfolio(req.user.id);

    res.status(200).json({ success: true, message: 'Investments refreshed' });
  } catch (error) {
    console.error('Error refreshing investments:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * Helper function to fetch current price from external API
 */
const fetchCurrentPrice = async (symbol) => {
  try {
    const response = await axios.get(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${process.env.FINNHUB_API_KEY}`
    );
    return response.data.c; // Current price
  } catch (error) {
    console.error('Error fetching current price:', error.message);
    throw new Error('Failed to fetch current price');
  }
};
