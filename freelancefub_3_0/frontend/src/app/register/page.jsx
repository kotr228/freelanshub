'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'freelancer',
    phone: '',
    telegram: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await register(formData);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-bold text-white">
          Реєстрація на FreelanceHub
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Ім'я</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-dark-lighter border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-dark-lighter border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Пароль</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-dark-lighter border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Роль</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-dark-lighter border border-gray-600 rounded-md text-white focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="freelancer">Фрілансер</option>
                <option value="client">Замовник</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Телефон</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+380..."
                className="mt-1 block w-full px-3 py-2 bg-dark-lighter border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">Telegram</label>
              <input
                type="text"
                name="telegram"
                value={formData.telegram}
                onChange={handleChange}
                placeholder="@username"
                className="mt-1 block w-full px-3 py-2 bg-dark-lighter border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm bg-primary text-dark font-semibold hover:bg-primary-dark focus:outline-none disabled:opacity-50 transition-colors"
          >
            {loading ? 'Завантаження...' : 'Зареєструватися'}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-primary hover:text-primary-dark transition-colors">
              Вже є акаунт? Увійти
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
