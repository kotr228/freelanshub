import jwt from 'jsonwebtoken';
import { User } from '../../models/sql/index.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    console.log('🔐 Auth middleware:', {
      hasAuth: !!req.headers.authorization,
      hasToken: !!token,
      hasSecret: !!process.env.JWT_SECRET
    });

    if (!token) {
      console.log('❌ Токен відсутній');
      return res.status(401).json({
        success: false,
        message: 'Не авторизовано, немає токену'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Токен декодовано:', { userId: decoded.id });

      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        console.log('❌ Користувача не знайдено в БД:', decoded.id);
        return res.status(401).json({
          success: false,
          message: 'Користувача не знайдено'
        });
      }

      console.log('✅ Користувач авторизований:', req.user.email);
      next();
    } catch (error) {
      console.log('❌ Помилка перевірки токену:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Не авторизовано, невалідний токен'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Помилка сервера'
    });
  }
};

// Middleware для перевірки ролі
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Роль ${req.user.role} не має доступу до цього ресурсу`
      });
    }
    next();
  };
};
