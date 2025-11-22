import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Будь ласка, введіть ім\'я'],
    trim: true,
    maxlength: [50, 'Ім\'я не може бути довшим за 50 символів']
  },
  email: {
    type: String,
    required: [true, 'Будь ласка, введіть email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Будь ласка, введіть коректний email']
  },
  password: {
    type: String,
    required: [true, 'Будь ласка, введіть пароль'],
    minlength: [6, 'Пароль повинен містити щонайменше 6 символів'],
    select: false
  },
  role: {
    type: String,
    enum: ['freelancer', 'client'],
    required: [true, 'Будь ласка, оберіть роль']
  },
  avatar: {
    type: String,
    default: 'default-avatar.png'
  },
  phone: {
    type: String,
    default: ''
  },
  telegram: {
    type: String,
    default: ''
  },
  // Поля для фрілансерів
  skills: [{
    type: String
  }],
  portfolio: [{
    title: String,
    description: String,
    url: String,
    image: String
  }],
  hourlyRate: {
    type: Number,
    default: 0
  },
  bio: {
    type: String,
    maxlength: [500, 'Біо не може бути довшим за 500 символів'],
    default: ''
  },
  // Поля для замовників
  company: {
    type: String,
    default: ''
  },
  // Загальні поля
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  completedProjects: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Хешування пароля перед збереженням
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Метод для перевірки пароля
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Метод для оновлення рейтингу
userSchema.methods.updateRating = async function() {
  const Review = mongoose.model('Review');
  const reviews = await Review.find({ 
    reviewedUser: this._id 
  });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = totalRating / reviews.length;
    this.reviewsCount = reviews.length;
  } else {
    this.rating = 0;
    this.reviewsCount = 0;
  }
  
  await this.save();
};

export default mongoose.model('User', userSchema);
