import Review from '../models/Review.js';
import Project from '../models/Project.js';
import User from '../models/User.js';

// @desc    Створити відгук
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { project, reviewedUser, rating, comment } = req.body;

    // Перевірка чи проєкт існує та завершений
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    if (projectExists.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Можна залишати відгук тільки для завершених проєктів'
      });
    }

    // Перевірка чи користувач належить до проєкту
    const isClient = projectExists.client.toString() === req.user.id;
    const isFreelancer = projectExists.freelancer && projectExists.freelancer.toString() === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    // Перевірка чи вже є відгук
    const existingReview = await Review.findOne({
      project,
      reviewer: req.user.id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Ви вже залишили відгук для цього проєкту'
      });
    }

    const review = await Review.create({
      project,
      reviewer: req.user.id,
      reviewedUser,
      rating,
      comment
    });

    // Оновити рейтинг користувача
    const user = await User.findById(reviewedUser);
    await user.updateRating();

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати відгуки користувача
// @route   GET /api/reviews/user/:userId
// @access  Public
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewedUser: req.params.userId })
      .populate('reviewer', 'name avatar')
      .populate('project', 'title')
      .sort('-createdAt');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати відгуки проєкту
// @route   GET /api/reviews/project/:projectId
// @access  Public
export const getProjectReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ project: req.params.projectId })
      .populate('reviewer', 'name avatar role')
      .populate('reviewedUser', 'name avatar role');

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
