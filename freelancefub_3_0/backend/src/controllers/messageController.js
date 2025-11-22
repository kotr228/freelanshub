import Message from '../models/Message.js';
import Project from '../models/Project.js';

// @desc    Отримати повідомлення для проєкту
// @route   GET /api/messages/:projectId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    // Перевірка доступу
    const hasAccess = 
      project.client.toString() === req.user.id ||
      (project.freelancer && project.freelancer.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    const messages = await Message.find({ project: req.params.projectId })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort('createdAt');

    // Позначити повідомлення як прочитані
    await Message.updateMany(
      {
        project: req.params.projectId,
        receiver: req.user.id,
        isRead: false
      },
      {
        isRead: true,
        readAt: Date.now()
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
    const { project, receiver, content } = req.body;

    const projectExists = await Project.findById(project);
    
    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: 'Проєкт не знайдено'
      });
    }

    // Перевірка доступу
    const hasAccess = 
      projectExists.client.toString() === req.user.id ||
      (projectExists.freelancer && projectExists.freelancer.toString() === req.user.id);

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Не авторизовано'
      });
    }

    const message = await Message.create({
      project,
      sender: req.user.id,
      receiver,
      content
    });

    await message.populate('sender', 'name avatar');
    await message.populate('receiver', 'name avatar');

    res.status(201).json({
      success: true,
      data: message
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
    const messages = await Message.find({
      receiver: req.user.id,
      isRead: false
    })
      .populate('sender', 'name avatar')
      .populate('project', 'title')
      .sort('-createdAt');

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
