import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-dark">
      <div className="bg-gradient-to-r from-dark-lighter to-dark-card text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6 text-white">
              Знайди найкращих фрілансерів
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Платформа для співпраці фрілансерів та замовників
            </p>
            <div className="space-x-4">
              <Link
                href="/register"
                className="bg-primary text-dark px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 inline-block transition-colors"
              >
                Почати роботу
              </Link>
              <Link
                href="/projects"
                className="bg-transparent border-2 border-primary text-primary px-8 py-3 rounded-lg font-semibold hover:bg-primary hover:text-dark inline-block transition-colors"
              >
                Переглянути проєкти
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Як це працює</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-dark-card rounded-lg hover:bg-dark-lighter transition-colors">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2 text-primary">1. Створіть проєкт</h3>
            <p className="text-gray-300">Опишіть ваше завдання та встановіть бюджет</p>
          </div>
          <div className="text-center p-6 bg-dark-card rounded-lg hover:bg-dark-lighter transition-colors">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-semibold mb-2 text-primary">2. Отримайте заявки</h3>
            <p className="text-gray-300">Фрілансери подадуть свої пропозиції</p>
          </div>
          <div className="text-center p-6 bg-dark-card rounded-lg hover:bg-dark-lighter transition-colors">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-semibold mb-2 text-primary">3. Виберіть виконавця</h3>
            <p className="text-gray-300">Оберіть найкращого та почніть роботу</p>
          </div>
        </div>
      </div>
    </div>
  );
}
