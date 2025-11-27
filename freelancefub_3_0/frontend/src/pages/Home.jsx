import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Знайди найкращих фрілансерів
            </h1>
            <p className="text-xl mb-8">
              Платформа для співпраці фрілансерів та замовників
            </p>
            <div className="space-x-4">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
              >
                Почати роботу
              </Link>
              <Link
                to="/projects"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 inline-block"
              >
                Переглянути проєкти
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Як це працює</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">1. Створіть проєкт</h3>
            <p className="text-gray-600">Опишіть ваше завдання та встановіть бюджет</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2">2. Отримайте заявки</h3>
            <p className="text-gray-600">Фрілансери подадуть свої пропозиції</p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2">3. Виберіть виконавця</h3>
            <p className="text-gray-600">Оберіть найкращого та почніть роботу</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
