import mongoose from 'mongoose';

const bidSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: [true, 'Будь ласка, вкажіть суму'],
    min: [0, 'Сума не може бути від\'ємною']
  },
  deliveryTime: {
    type: Number,
    required: [true, 'Будь ласка, вкажіть термін виконання'],
    min: [1, 'Термін виконання повинен бути принаймні 1 день']
  },
  coverLetter: {
    type: String,
    required: [true, 'Будь ласка, напишіть супровідний лист'],
    maxlength: [1000, 'Супровідний лист не може бути довшим за 1000 символів']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Індекси
bidSchema.index({ project: 1, freelancer: 1 }, { unique: true }); // Один фрілансер може подати тільки одну заявку на проєкт
bidSchema.index({ project: 1, status: 1 });
bidSchema.index({ freelancer: 1, status: 1 });

export default mongoose.model('Bid', bidSchema);
