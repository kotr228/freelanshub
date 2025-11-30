import User from '../../models/mysql/User.js';
import { Op } from 'sequelize';

// Отримати профіль користувача за ID
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Помилка отримання профілю:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Оновити профіль користувача
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, telegram, bio, avatar, skills, portfolio, hourly_rate, company } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Користувача не знайдено' });
    }

    // Оновити дозволені поля
    user.name = name || user.name;
    user.phone = phone !== undefined ? phone : user.phone;
    user.telegram = telegram !== undefined ? telegram : user.telegram;
    user.bio = bio !== undefined ? bio : user.bio;
    user.avatar = avatar !== undefined ? avatar : user.avatar;

    // Поля для фрілансерів
    if (user.role === 'freelancer') {
      user.skills = skills !== undefined ? skills : user.skills;
      user.portfolio = portfolio !== undefined ? portfolio : user.portfolio;
      user.hourly_rate = hourly_rate !== undefined ? hourly_rate : user.hourly_rate;
    }

    // Поля для клієнтів
    if (user.role === 'client') {
      user.company = company !== undefined ? company : user.company;
    }

    await user.save();

    // Повернути оновлені дані без пароля
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error('Помилка оновлення профілю:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};

// Отримати список фрілансерів
export const getFreelancers = async (req, res) => {
  try {
    const { skills, minRate, maxRate } = req.query;

    const where = { role: 'freelancer', is_active: 1 };

    if (skills) {
      where.skills = { [Op.like]: `%${skills}%` };
    }

    if (minRate || maxRate) {
      where.hourly_rate = {};
      if (minRate) where.hourly_rate[Op.gte] = parseFloat(minRate);
      if (maxRate) where.hourly_rate[Op.lte] = parseFloat(maxRate);
    }

    const freelancers = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order: [['rating', 'DESC']]
    });

    res.json({ success: true, data: freelancers });
  } catch (error) {
    console.error('Помилка отримання фрілансерів:', error);
    res.status(500).json({ message: 'Помилка сервера' });
  }
};
