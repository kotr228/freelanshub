import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Перевірка наявності змінних
if (!process.env.DB_NAME || !process.env.DB_USER) {
  console.error('❌ MySQL налаштування не знайдено в .env файлі!');
  console.log('\n📝 Додайте в .env:');
  console.log('DB_HOST=localhost');
  console.log('DB_PORT=3306');
  console.log('DB_NAME=freelancehub');
  console.log('DB_USER=root');
  console.log('DB_PASSWORD=ваш_пароль\n');
  process.exit(1);
}

// Створення підключення Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: false,
      freezeTableName: true
    }
  }
);

// Функція підключення
export const connectDB = async () => {
  try {
    console.log('🔌 Підключення до MySQL...');
    await sequelize.authenticate();
    console.log(`✅ MySQL підключено: ${process.env.DB_HOST}`);
    
    // Синхронізація моделей з БД (не перезаписує існуючі таблиці)
    await sequelize.sync({ alter: false });
    console.log('✅ Моделі синхронізовано');
  } catch (error) {
    console.error(`❌ Помилка підключення до MySQL: ${error.message}`);
    console.log('\n💡 Перевірте:');
    console.log('- Чи запущений MySQL сервер');
    console.log('- Чи правильні дані в .env файлі');
    console.log('- Чи існує база даних', process.env.DB_NAME);
    process.exit(1);
  }
};

export default sequelize;
