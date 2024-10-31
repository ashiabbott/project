import User from '../models/User.js';

// @desc    Get user's settings
// @route   GET /api/settings
// @access  Private
export const getSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings');
    res.json(user.settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Update user's settings
// @route   PUT /api/settings
// @access  Private
export const updateSettings = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { settings: req.body },
      { new: true, select: 'settings' },
    );
    res.json(user.settings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
