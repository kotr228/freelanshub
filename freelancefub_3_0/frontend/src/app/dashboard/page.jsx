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

  if (loading) return <div className="text-center py-12">Завантаження...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Панель управління</h1>
      <div className="grid gap-6">
        {projects.map(p => (
          <div key={p.id} className="bg-white p-6 rounded-lg shadow">
            <Link href={`/projects/${p.id}`}>
              <h3 className="text-xl font-semibold mb-2">{p.title}</h3>
              <p className="text-gray-600">{p.description}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
