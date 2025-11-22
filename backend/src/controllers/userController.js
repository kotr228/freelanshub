import User from '../models/User.js';

// @desc    Отримати профіль користувача
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Оновити профіль
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.telegram = req.body.telegram || user.telegram;
      user.bio = req.body.bio || user.bio;
      user.avatar = req.body.avatar || user.avatar;

      if (user.role === 'freelancer') {
        user.skills = req.body.skills || user.skills;
        user.hourlyRate = req.body.hourlyRate || user.hourlyRate;
        user.portfolio = req.body.portfolio || user.portfolio;
      }

      if (user.role === 'client') {
        user.company = req.body.company || user.company;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: updatedUser
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Користувача не знайдено'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати список фрілансерів
// @route   GET /api/users/freelancers
// @access  Public
export const getFreelancers = async (req, res) => {
  try {
    const { skills, minRating, maxRate } = req.query;
    
    let query = { role: 'freelancer', isActive: true };

    if (skills) {
      query.skills = { $in: skills.split(',') };
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (maxRate) {
      query.hourlyRate = { $lte: parseFloat(maxRate) };
    }

    const freelancers = await User.find(query)
      .select('-password')
      .sort('-rating');

    res.json({
      success: true,
      count: freelancers.length,
      data: freelancers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
