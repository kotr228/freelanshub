'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usersAPI } from '@/lib/api';

export default function Settings() {
  const { user, checkAuth } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    telegram: '',
    bio: '',
    avatar: '',
    // Для фрілансерів
    skills: '',
    portfolio: '',
    hourly_rate: '',
    // Для клієнтів
    company: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        telegram: user.telegram || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        skills: user.skills || '',
        portfolio: user.portfolio || '',
        hourly_rate: user.hourly_rate || '',
        company: user.company || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await usersAPI.updateProfile(formData);
      setSuccess('✅ Профіль успішно оновлено!');

      // Оновити дані користувача в AuthContext
      if (checkAuth) {
        await checkAuth();
      }

      // Перенаправити на профіль через 2 секунди
      setTimeout(() => {
        router.push(`/profile/${user.id}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Помилка оновлення профілю');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return <div className="text-center py-12 text-gray-300">Завантаження...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="bg-dark-card rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">Редагування профілю</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 text-red-200 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-900/50 border border-green-500 text-green-200 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основна інформація */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Основна інформація</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Ім'я <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Email (не змінюється)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+380..."
                  className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Telegram</label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  placeholder="@username"
                  className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Про себе</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Розкажіть про себе..."
                  className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Аватар (URL)</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Вставте посилання на зображення з інтернету
                </p>
              </div>
            </div>
          </div>

          {/* Поля для фрілансерів */}
          {user.role === 'freelancer' && (
            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Професійна інформація</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Навички</label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows="3"
                    placeholder="JavaScript, React, Node.js, MySQL..."
                    className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Перерахуйте свої навички через кому
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Портфоліо (посилання)</label>
                  <textarea
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    rows="3"
                    placeholder="https://github.com/username&#10;https://behance.net/username&#10;https://dribbble.com/username"
                    className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Посилання на ваші роботи (кожне з нового рядка)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Погодинна ставка (₴/год)</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="500"
                    className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Поля для клієнтів */}
          {user.role === 'client' && (
            <div className="border-t border-gray-700 pt-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Інформація про компанію</h2>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Назва компанії</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="ТОВ 'Моя компанія'"
                  className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-700">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-dark px-6 py-3 rounded-lg hover:bg-primary-dark disabled:bg-gray-600 disabled:cursor-not-allowed font-semibold transition-colors"
            >
              {loading ? 'Збереження...' : 'Зберегти зміни'}
            </button>

            <button
              type="button"
              onClick={() => router.push(`/profile/${user.id}`)}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold transition-colors"
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
