'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { usersAPI } from '@/lib/api';

export default function Profile() {
  const params = useParams();
  const userId = params.id;
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await usersAPI.getProfile(userId);
      setProfileUser(response.data.data);
    } catch (error) {
      console.error('Помилка завантаження профілю:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Завантаження...</div>;
  }

  if (!profileUser) {
    return <div className="text-center py-12">Користувача не знайдено</div>;
  }

  const isOwnProfile = currentUser?.id === profileUser.id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Шапка профілю */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32"></div>

        <div className="px-6 pb-6">
          {/* Аватар та основна інформація */}
          <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-600 overflow-hidden">
              {profileUser.avatar && profileUser.avatar !== 'default-avatar.png' ? (
                <img src={profileUser.avatar} alt={profileUser.name} className="w-full h-full object-cover" />
              ) : (
                <span>{profileUser.name[0]?.toUpperCase()}</span>
              )}
            </div>

            <div className="mt-4 md:mt-0 md:ml-6 flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{profileUser.name}</h1>
                  <p className="text-gray-600">
                    {profileUser.role === 'freelancer' ? '👨‍💻 Фрілансер' : '👔 Замовник'}
                  </p>
                </div>

                {isOwnProfile && (
                  <Link
                    href="/settings"
                    className="mt-4 md:mt-0 bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 inline-block text-center"
                  >
                    ✏️ Редагувати профіль
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {profileUser.rating ? profileUser.rating.toFixed(1) : '0.0'}
              </div>
              <div className="text-sm text-gray-600">Рейтинг</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profileUser.reviews_count || 0}</div>
              <div className="text-sm text-gray-600">Відгуків</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{profileUser.completed_projects || 0}</div>
              <div className="text-sm text-gray-600">Проєктів</div>
            </div>
          </div>

          {/* Контактна інформація */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Контакти</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">📧 Email:</span>
                <span>{profileUser.email}</span>
              </div>
              {profileUser.phone && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">📱 Телефон:</span>
                  <span>{profileUser.phone}</span>
                </div>
              )}
              {profileUser.telegram && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">💬 Telegram:</span>
                  <a
                    href={`https://t.me/${profileUser.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {profileUser.telegram}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Про себе */}
          {profileUser.bio && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Про себе</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{profileUser.bio}</p>
            </div>
          )}

          {/* Для фрілансерів */}
          {profileUser.role === 'freelancer' && (
            <>
              {profileUser.skills && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Навички</h2>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skills.split(',').map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profileUser.hourly_rate && profileUser.hourly_rate > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Погодинна ставка</h2>
                  <p className="text-2xl font-bold text-primary">
                    {profileUser.hourly_rate} ₴/год
                  </p>
                </div>
              )}

              {profileUser.portfolio && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Портфоліо</h2>
                  <div className="space-y-2">
                    {profileUser.portfolio.split('\n').filter(link => link.trim()).map((link, index) => (
                      <div key={index}>
                        <a
                          href={link.trim()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          🔗 {link.trim()}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Для клієнтів */}
          {profileUser.role === 'client' && profileUser.company && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Компанія</h2>
              <p className="text-lg">{profileUser.company}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
