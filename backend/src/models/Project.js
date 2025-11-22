import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Будь ласка, введіть назву проєкту'],
    trim: true,
    maxlength: [100, 'Назва не може бути довшою за 100 символів']
  },
  description: {
    type: String,
    required: [true, 'Будь ласка, введіть опис проєкту'],
    maxlength: [2000, 'Опис не може бути довшим за 2000 символів']
  },
  category: {
    type: String,
    required: [true, 'Будь ласка, оберіть категорію'],
    enum: [
      'Веб-розробка',
      'Мобільна розробка',
      'Дизайн',
      'Копірайтинг',
      'Маркетинг',
      'SEO',
      'Відеомонтаж',
      'Переклад',
      'Інше'
    ]
  },
  budgetType: {
    type: String,
    enum: ['fixed', 'hourly'],
    required: [true, 'Будь ласка, оберіть тип бюджету'],
    default: 'fixed'
  },
  budget: {
    type: Number,
    required: [true, 'Будь ласка, вкажіть бюджет'],
    min: [0, 'Бюджет не може бути від\'ємним']
  },
  deadline: {
    type: Date
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'review', 'completed', 'cancelled'],
    default: 'open'
  },
  skills: [{
    type: String
  }],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  bidsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Індекси для пошуку
projectSchema.index({ title: 'text', description: 'text' });
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ client: 1, status: 1 });
projectSchema.index({ freelancer: 1, status: 1 });

export default mongoose.model('Project', projectSchema);
