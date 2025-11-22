import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI } from '../../services/api';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getOne(id);
      setProject(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Завантаження...</div>;
  if (!project) return <div className="text-center py-12">Проєкт не знайдено</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-700 mb-4">{project.description}</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-semibold">Бюджет:</span> {project.budget} грн
          </div>
          <div>
            <span className="font-semibold">Категорія:</span> {project.category}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
