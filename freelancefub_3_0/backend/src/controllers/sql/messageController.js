import { Message, Project, User } from '../../models/sql/index.js';
import { Op } from 'sequelize';

// @desc    Отримати повідомлення для проєкту
// @route   GET /api/messages/:projectId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    // Перевірка доступу
    const hasAccess =
      project.client_id === req.user.id ||
      (project.freelancer_id && project.freelancer_id === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    const messages = await Message.findAll({
      where: { project_id: req.params.projectId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'avatar']
        }
      ],
      order: [['created_at', 'ASC']]
    });

    // Позначити повідомлення як прочитані
    await Message.update(
      {
        is_read: true,
        read_at: new Date()
      },
      {
        where: {
          project_id: req.params.projectId,
          receiver_id: req.user.id,
          is_read: false
        }
      }
    );

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Надіслати повідомлення
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { projectId, receiverId, content } = req.body;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    // Перевірка доступу
    const hasAccess =
      project.client_id === req.user.id ||
      (project.freelancer_id && project.freelancer_id === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    const message = await Message.create({
      project_id: projectId,
      sender_id: req.user.id,
      receiver_id: receiverId,
      content
    });

    // Завантажити зв'язані дані
    const fullMessage = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'name', 'avatar']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: fullMessage
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати непрочитані повідомлення
// @route   GET /api/messages/unread
// @access  Private
export const getUnreadMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: {
        receiver_id: req.user.id,
        is_read: false
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title']
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Отримати список чатів користувача
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    // Знайти всі проєкти де користувач є клієнтом або фрілансером
    const projects = await Project.findAll({
      where: {
        [Op.or]: [
          { client_id: req.user.id },
          { freelancer_id: req.user.id }
        ],
        freelancer_id: { [Op.ne]: null } // Тільки проєкти з призначеним фрілансером
      },
      include: [
        {
          model: User,
          as: 'client',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'name', 'avatar']
        }
      ]
    });

    // Для кожного проєкту отримати останнє повідомлення та кількість непрочитаних
    const conversations = await Promise.all(
      projects.map(async (project) => {
        const lastMessage = await Message.findOne({
          where: { project_id: project.id },
          order: [['created_at', 'DESC']]
        });

        const unreadCount = await Message.count({
          where: {
            project_id: project.id,
            receiver_id: req.user.id,
            is_read: false
          }
        });

        return {
          project,
          lastMessage,
          unreadCount
        };
      })
    );

    // Відсортувати по останньому повідомленню
    conversations.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.created_at) - new Date(a.lastMessage.created_at);
    });

    res.json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
