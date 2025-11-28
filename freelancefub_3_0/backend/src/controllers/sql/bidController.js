import { Bid, Project, User } from '../../models/sql/index.js';
import { Op} from 'sequelize';

// @desc    Створити заявку на проєкт
// @route   POST /api/bids
// @access  Private (Freelancer)
export const createBid = async (req, res) => {
  try {
    const { projectId, amount, deliveryTime, coverLetter } = req.body;

    // Перевірка чи проєкт існує та відкритий
    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    if (project.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Проєкт більше не приймає заявки'
      });
    }

    // Перевірка чи фрілансер вже подав заявку
    const existingBid = await Bid.findOne({
      where: {
        project_id: projectId,
        freelancer_id: req.user.id
      }
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'Ви вже подали заявку на цей проєкт'
      });
    }

    const bid = await Bid.create({
      project_id: projectId,
      freelancer_id: req.user.id,
      amount,
      delivery_time: deliveryTime,
      cover_letter: coverLetter
    });

    // Оновити кількість заявок у проєкті
    await project.increment('bids_count');

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
    const project = await Project.findByPk(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    if (project.client_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    const bids = await Bid.findAll({
      where: { project_id: req.params.projectId },
      include: [{
        model: User,
        as: 'freelancer',
        attributes: ['id', 'name', 'avatar', 'rating', 'reviews_count', 'skills', 'hourly_rate']
      }],
      order: [['created_at', 'DESC']]
    });

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
    const bids = await Bid.findAll({
      where: { freelancer_id: req.user.id },
      include: [{
        model: Project,
        as: 'project'
      }],
      order: [['created_at', 'DESC']]
    });

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
    const bid = await Bid.findByPk(req.params.id, {
      include: [{ model: Project, as: 'project' }]
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Заявку не знайдено'
      });
    }

    // Перевірка прав
    if (bid.project.client_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    // Оновити статус заявки
    bid.status = 'accepted';
    await bid.save();

    // Оновити проєкт
    await bid.project.update({
      freelancer_id: bid.freelancer_id,
      status: 'in_progress'
    });

    // Відхилити всі інші заявки
    await Bid.update(
      { status: 'rejected' },
      {
        where: {
          project_id: bid.project_id,
          id: { [Op.ne]: bid.id }
        }
      }
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
    const bid = await Bid.findByPk(req.params.id, {
      include: [{ model: Project, as: 'project' }]
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Заявку не знайдено'
      });
    }

    if (bid.project.client_id !== req.user.id) {
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
