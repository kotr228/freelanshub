import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Перевірка наявності MONGODB_URI
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI не знайдено в .env файлі!');
      console.log('\n📝 Інструкції:');
      console.log('1. Створіть файл .env в папці backend/');
      console.log('2. Додайте: MONGODB_URI=mongodb://localhost:27017/freelancehub');
      console.log('3. Або використайте MongoDB Atlas (безкоштовно): https://www.mongodb.com/cloud/atlas\n');
      process.exit(1);
    }

    console.log('🔌 Підключення до MongoDB...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB підключено: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Помилка підключення до MongoDB: ${error.message}`);
    console.log('\n💡 Можливі причини:');
    console.log('- MongoDB не запущена локально (запустіть: mongod)');
    console.log('- Невірний MONGODB_URI в .env файлі');
    console.log('- Використайте MongoDB Atlas для безкоштовного хмарного DB\n');
    process.exit(1);
  }
};

export default connectDB;
