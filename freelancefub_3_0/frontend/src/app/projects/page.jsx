'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { projectsAPI } from '@/lib/api';

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

  if (loading) return <div className="text-center py-12 text-gray-300">Завантаження...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Проєкти</h1>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Пошук..."
          className="flex-1 px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          className="px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-primary focus:border-primary"
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">Всі категорії</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-dark-card p-6 rounded-lg shadow hover:shadow-xl transition-shadow">
            <Link href={`/projects/${project.id}`}>
              <h3 className="text-xl font-semibold mb-2 text-white">{project.title}</h3>
              <p className="text-gray-300 mb-4 line-clamp-2">{project.description}</p>
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 flex-wrap">
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                    {project.category}
                  </span>
                  <span className="bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-sm">
                    {project.budget} грн
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  Заявок: {project.bids_count || 0}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          Проєктів не знайдено
        </div>
      )}
    </div>
  );
};

export default Projects;
