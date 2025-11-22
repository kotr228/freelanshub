import Bid from '../models/Bid.js';
import Project from '../models/Project.js';

// @desc    Створити заявку на проєкт
// @route   POST /api/bids
// @access  Private (Freelancer)
export const createBid = async (req, res) => {
  try {
    const { project, amount, deliveryTime, coverLetter } = req.body;

    // Перевірка чи проєкт існує та відкритий
    const projectExists = await Project.findById(project);
    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    if (projectExists.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Проєкт більше не приймає заявки'
      });
    }

    // Перевірка чи фрілансер вже подав заявку
    const existingBid = await Bid.findOne({
      project,
      freelancer: req.user.id
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'Ви вже подали заявку на цей проєкт'
      });
    }

    const bid = await Bid.create({
      project,
      freelancer: req.user.id,
      amount,
      deliveryTime,
      coverLetter
    });

    // Оновити кількість заявок у проєкті
    await Project.findByIdAndUpdate(project, {
      $inc: { bidsCount: 1 }
    });

    res.status(201).json({
      success: true,
      data: bid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати всі заявки для проєкту
// @route   GET /api/bids/project/:projectId
// @access  Private (Client - власник проєкту)
export const getProjectBids = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    if (project.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    const bids = await Bid.find({ project: req.params.projectId })
      .populate('freelancer', 'name avatar rating reviewsCount skills hourlyRate')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати мої заявки (для фрілансера)
// @route   GET /api/bids/my
// @access  Private (Freelancer)
export const getMyBids = async (req, res) => {
  try {
    const bids = await Bid.find({ freelancer: req.user.id })
      .populate('project')
      .sort('-createdAt');

    res.json({
      success: true,
      count: bids.length,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Прийняти заявку
// @route   PUT /api/bids/:id/accept
// @access  Private (Client)
export const acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('project');

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Заявку не знайдено'
      });
    }

    // Перевірка прав
    if (bid.project.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    // Оновити статус заявки
    bid.status = 'accepted';
    await bid.save();

    // Оновити проєкт
    await Project.findByIdAndUpdate(bid.project._id, {
      freelancer: bid.freelancer,
      status: 'in_progress'
    });

    // Відхилити всі інші заявки
    await Bid.updateMany(
      {
        project: bid.project._id,
        _id: { $ne: bid._id }
      },
      { status: 'rejected' }
    );

    res.json({
      success: true,
      data: bid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Відхилити заявку
// @route   PUT /api/bids/:id/reject
// @access  Private (Client)
export const rejectBid = async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('project');

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Заявку не знайдено'
      });
    }

    if (bid.project.client.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    bid.status = 'rejected';
    await bid.save();

    res.json({
      success: true,
      data: bid
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
