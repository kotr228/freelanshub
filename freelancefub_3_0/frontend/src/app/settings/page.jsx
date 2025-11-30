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
    return <div className="text-center py-12">Завантаження...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6">Редагування профілю</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основна інформація */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Основна інформація</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Ім'я <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email (не змінюється)</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full px-4 py-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Телефон</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+380..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Telegram</label>
                <input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  placeholder="@username"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Про себе</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Розкажіть про себе..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Аватар (URL)</label>
                <input
                  type="url"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Вставте посилання на зображення з інтернету
                </p>
              </div>
            </div>
          </div>

          {/* Поля для фрілансерів */}
          {user.role === 'freelancer' && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Професійна інформація</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Навички</label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows="3"
                    placeholder="JavaScript, React, Node.js, MySQL..."
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Перерахуйте свої навички через кому
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Портфоліо (посилання)</label>
                  <textarea
                    name="portfolio"
                    value={formData.portfolio}
                    onChange={handleChange}
                    rows="3"
                    placeholder="https://github.com/username&#10;https://behance.net/username&#10;https://dribbble.com/username"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Посилання на ваші роботи (кожне з нового рядка)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Погодинна ставка (₴/год)</label>
                  <input
                    type="number"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="500"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Поля для клієнтів */}
          {user.role === 'client' && (
            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold mb-4">Інформація про компанію</h2>

              <div>
                <label className="block text-sm font-medium mb-2">Назва компанії</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="ТОВ 'Моя компанія'"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Збереження...' : '💾 Зберегти зміни'}
            </button>

            <button
              type="button"
              onClick={() => router.push(`/profile/${user.id}`)}
              className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Скасувати
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
