import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectsAPI } from '../../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', search: '' });

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll(filters);
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Веб-розробка', 'Мобільна розробка', 'Дизайн', 
    'Копірайтинг', 'Маркетинг', 'SEO', 'Відеомонтаж', 'Переклад'
  ];

  if (loading) return <div className="text-center py-12">Завантаження...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Проєкти</h1>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Пошук..."
          className="flex-1 px-4 py-2 border rounded-lg"
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="px-4 py-2 border rounded-lg"
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">Всі категорії</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-6">
        {projects.map(project => (
          <div key={project._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <Link to={`/projects/${project._id}`}>
              <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {project.category}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    {project.budget} грн
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  Заявок: {project.bidsCount || 0}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          Проєктів не знайдено
        </div>
      )}
    </div>
  );
};

export default Projects;
