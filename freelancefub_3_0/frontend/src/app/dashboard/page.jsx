'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { projectsAPI } from '@/lib/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMyProjects(); }, []);

  const fetchMyProjects = async () => {
    try {
      const response = user?.role === 'client' ? await projectsAPI.getMyClientProjects() : await projectsAPI.getMyFreelancerProjects();
      setProjects(response.data.data);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="text-center py-12 text-gray-300">Завантаження...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Панель управління</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-dark-card p-6 rounded-lg shadow hover:shadow-xl transition-shadow">
            <Link href={`/projects/${p.id}`}>
              <h3 className="text-xl font-semibold mb-2 text-white">{p.title}</h3>
              <p className="text-gray-300 line-clamp-3">{p.description}</p>
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

export default Dashboard;
