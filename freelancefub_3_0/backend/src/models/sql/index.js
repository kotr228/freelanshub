import { DataTypes } from 'sequelize';
import sequelize from '../../config/mysql.js';
import bcrypt from 'bcryptjs';

// ============================================
// User Model
// ============================================
export const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('freelancer', 'client'),
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING(255),
    defaultValue: 'default-avatar.png'
  },
  phone: DataTypes.STRING(50),
  telegram: DataTypes.STRING(100),
  skills: DataTypes.TEXT,
  portfolio: DataTypes.TEXT,
  hourly_rate: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  bio: DataTypes.TEXT,
  company: DataTypes.STRING(150),
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  reviews_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completed_projects: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Хешування пароля перед збереженням
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Метод перевірки пароля
User.prototype.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ============================================
// Project Model
// ============================================
export const Project = sequelize.define('projects', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM('Веб-розробка','Мобільна розробка','Дизайн','Копірайтинг','Маркетинг','SEO','Відеомонтаж','Переклад','Інше'),
    allowNull: false
  },
  budget_type: {
    type: DataTypes.ENUM('fixed', 'hourly'),
    defaultValue: 'fixed'
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  deadline: DataTypes.DATE,
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  freelancer_id: DataTypes.INTEGER,
  status: {
    type: DataTypes.ENUM('open','in_progress','review','completed','cancelled'),
    defaultValue: 'open'
  },
  skills: DataTypes.TEXT,
  bids_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  completed_at: DataTypes.DATE
}, {
  tableName: 'projects',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// ============================================
// Bid Model
// ============================================
export const Bid = sequelize.define('bids', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  freelancer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  delivery_time: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cover_letter: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending','accepted','rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'bids',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// ============================================
// Review Model
// ============================================
export const Review = sequelize.define('reviews', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reviewer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reviewed_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  rating: {
    type: DataTypes.TINYINT,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: DataTypes.TEXT
}, {
  tableName: 'reviews',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// ============================================
// Message Model
// ============================================
export const Message = sequelize.define('messages', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  read_at: DataTypes.DATE
}, {
  tableName: 'messages',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// ============================================
// Associations (Зв'язки)
// ============================================

// User - Project
User.hasMany(Project, { foreignKey: 'client_id', as: 'clientProjects' });
User.hasMany(Project, { foreignKey: 'freelancer_id', as: 'freelancerProjects' });
Project.belongsTo(User, { foreignKey: 'client_id', as: 'client' });
Project.belongsTo(User, { foreignKey: 'freelancer_id', as: 'freelancer' });

// User - Bid
User.hasMany(Bid, { foreignKey: 'freelancer_id' });
Bid.belongsTo(User, { foreignKey: 'freelancer_id', as: 'freelancer' });

// Project - Bid
Project.hasMany(Bid, { foreignKey: 'project_id' });
Bid.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// Review associations
Review.belongsTo(User, { foreignKey: 'reviewer_id', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'reviewed_user_id', as: 'reviewedUser' });
Review.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

// Message associations
Message.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });
Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiver_id', as: 'receiver' });

export default { User, Project, Bid, Review, Message };
