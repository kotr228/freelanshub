'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { projectsAPI } from '@/lib/api';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Веб-розробка',
    budgetType: 'fixed', budget: ''
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.create(formData);
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const categories = [
    'Веб-розробка', 'Мобільна розробка', 'Дизайн',
    'Копірайтинг', 'Маркетинг', 'SEO', 'Відеомонтаж', 'Переклад', 'Інше'
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Створити проєкт</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-dark-card p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Назва</label>
          <input type="text" required
            className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Введіть назву проєкту" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Опис</label>
          <textarea required
            className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
            rows="5"
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Опишіть детально ваш проєкт" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Категорія</label>
          <select required
            className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-primary focus:border-primary"
            value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Тип бюджету</label>
          <select
            className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-primary focus:border-primary"
            value={formData.budgetType} onChange={(e) => setFormData({...formData, budgetType: e.target.value})}>
            <option value="fixed">Фіксована ціна</option>
            <option value="hourly">Погодинна оплата</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-300">Бюджет (грн)</label>
          <input type="number" required
            className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
            value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})}
            placeholder="0" />
        </div>
        <button type="submit" className="w-full bg-primary text-dark font-semibold py-3 rounded-lg hover:bg-primary-dark transition-colors">
          Створити
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
