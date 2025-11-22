import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewedUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Будь ласка, поставте оцінку'],
    min: [1, 'Мінімальна оцінка - 1'],
    max: [5, 'Максимальна оцінка - 5']
  },
  comment: {
    type: String,
    maxlength: [500, 'Коментар не може бути довшим за 500 символів']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Індекси
reviewSchema.index({ project: 1, reviewer: 1 }, { unique: true }); // Один користувач може залишити тільки один відгук на проєкт
reviewSchema.index({ reviewedUser: 1 });

export default mongoose.model('Review', reviewSchema);
