import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectsAPI } from '../../services/api';

const CreateProject = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Веб-розробка',
    budgetType: 'fixed', budget: ''
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectsAPI.create(formData);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const categories = [
    'Веб-розробка', 'Мобільна розробка', 'Дизайн',
    'Копірайтинг', 'Маркетинг', 'SEO', 'Відеомонтаж', 'Переклад', 'Інше'
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Створити проєкт</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Назва</label>
          <input type="text" required className="w-full px-4 py-2 border rounded-lg"
            value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Опис</label>
          <textarea required className="w-full px-4 py-2 border rounded-lg" rows="5"
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Категорія</label>
          <select required className="w-full px-4 py-2 border rounded-lg"
            value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Тип бюджету</label>
          <select className="w-full px-4 py-2 border rounded-lg"
            value={formData.budgetType} onChange={(e) => setFormData({...formData, budgetType: e.target.value})}>
            <option value="fixed">Фіксована ціна</option>
            <option value="hourly">Погодинна оплата</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Бюджет (грн)</label>
          <input type="number" required className="w-full px-4 py-2 border rounded-lg"
            value={formData.budget} onChange={(e) => setFormData({...formData, budget: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600">
          Створити
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
