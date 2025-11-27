import { Project, User, Bid } from '../../models/sql/index.js';
import { Op } from 'sequelize';

// @desc    Створити новий проєкт
// @route   POST /api/projects
// @access  Private (Client)
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      client_id: req.user.id
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

    let where = {};

    // Фільтр за статусом
    if (status) {
      where.status = status;
    }

    // Фільтр за категорією
    if (category) {
      where.category = category;
    }

    // Фільтр за бюджетом
    if (budgetMin || budgetMax) {
      where.budget = {};
      if (budgetMin) where.budget[Op.gte] = parseFloat(budgetMin);
      if (budgetMax) where.budget[Op.lte] = parseFloat(budgetMax);
    }

    // Пошук
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const projects = await Project.findAll({
      where,
      include: [{
        model: User,
        as: 'client',
        attributes: ['id', 'name', 'avatar', 'rating', 'reviews_count']
      }],
      order: [['created_at', 'DESC']]
    });

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
    const project = await Project.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'avatar', 'rating', 'reviews_count', 'company']
        },
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'name', 'avatar', 'rating', 'reviews_count', 'skills']
        }
      ]
    });

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
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    // Перевірка власника
    if (project.client_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано для оновлення цього проєкту'
      });
    }

    await project.update(req.body);

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
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    if (project.client_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано для видалення цього проєкту'
      });
    }

    await project.destroy();

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
    const projects = await Project.findAll({
      where: { client_id: req.user.id },
      include: [{
        model: User,
        as: 'freelancer',
        attributes: ['id', 'name', 'avatar', 'rating']
      }],
      order: [['created_at', 'DESC']]
    });

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
    const projects = await Project.findAll({
      where: { freelancer_id: req.user.id },
      include: [{
        model: User,
        as: 'client',
        attributes: ['id', 'name', 'avatar', 'rating', 'company']
      }],
      order: [['created_at', 'DESC']]
    });

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
    const project = await Project.findByPk(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    // Перевірка прав
    const isClient = project.client_id === req.user.id;
    const isFreelancer = project.freelancer_id && project.freelancer_id === req.user.id;

    if (!isClient && !isFreelancer) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    project.status = status;

    if (status === 'completed') {
      project.completed_at = new Date();
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
