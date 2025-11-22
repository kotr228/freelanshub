import Project from '../models/Project.js';
import Bid from '../models/Bid.js';

// @desc    Створити новий проєкт
// @route   POST /api/projects
// @access  Private (Client)
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      client: req.user.id
    });

    res.status(201).json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати всі проєкти з фільтрацією
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const { category, budgetMin, budgetMax, search, status = 'open' } = req.query;
    
    let query = {};

    // Фільтр за статусом
    if (status) {
      query.status = status;
    }

    // Фільтр за категорією
    if (category) {
      query.category = category;
    }

    // Фільтр за бюджетом
    if (budgetMin || budgetMax) {
      query.budget = {};
      if (budgetMin) query.budget.$gte = parseFloat(budgetMin);
      if (budgetMax) query.budget.$lte = parseFloat(budgetMax);
    }

    // Пошук
    if (search) {
      query.$text = { $search: search };
    }

    const projects = await Project.find(query)
      .populate('client', 'name avatar rating reviewsCount')
      .sort('-createdAt');

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати проєкт за ID
// @route   GET /api/projects/:id
// @access  Public
export const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('client', 'name avatar rating reviewsCount company')
      .populate('freelancer', 'name avatar rating reviewsCount skills');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Оновити проєкт
// @route   PUT /api/projects/:id
// @access  Private (Client - власник)
export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    // Перевірка власника
    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано для оновлення цього проєкту'
      });
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Видалити проєкт
// @route   DELETE /api/projects/:id
// @access  Private (Client - власник)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано для видалення цього проєкту'
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Проєкт видалено'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати мої проєкти (для клієнта)
// @route   GET /api/projects/my/client
// @access  Private (Client)
export const getMyClientProjects = async (req, res) => {
  try {
    const projects = await Project.find({ client: req.user.id })
      .populate('freelancer', 'name avatar rating')
      .sort('-createdAt');

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати мої проєкти (для фрілансера)
// @route   GET /api/projects/my/freelancer
// @access  Private (Freelancer)
export const getMyFreelancerProjects = async (req, res) => {
  try {
    const projects = await Project.find({ freelancer: req.user.id })
      .populate('client', 'name avatar rating company')
      .sort('-createdAt');

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Оновити статус проєкту
// @route   PUT /api/projects/:id/status
// @access  Private
export const updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    // Перевірка прав
    const isClient = project.client.toString() === req.user.id;
    const isFreelancer = project.freelancer && project.freelancer.toString() === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    project.status = status;
    
    if (status === 'completed') {
      project.completedAt = Date.now();
    }

    await project.save();

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
