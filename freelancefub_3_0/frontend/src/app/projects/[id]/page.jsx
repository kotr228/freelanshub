'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { projectsAPI, bidsAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidForm, setShowBidForm] = useState(false);
  const [bidData, setBidData] = useState({
    amount: '',
    deliveryTime: '',
    coverLetter: ''
  });

  useEffect(() => {
    fetchProject();
    if (user?.role === 'client') {
      fetchBids();
    }
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

  const fetchBids = async () => {
    try {
      const response = await bidsAPI.getProjectBids(id);
      setBids(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    try {
      await bidsAPI.create({ projectId: id, ...bidData });
      alert('Заявка успішно подана!');
      setShowBidForm(false);
      setBidData({ amount: '', deliveryTime: '', coverLetter: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Помилка при поданні заявки');
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await bidsAPI.accept(bidId);
      alert('Заявка прийнята!');
      fetchProject();
      fetchBids();
    } catch (error) {
      alert(error.response?.data?.message || 'Помилка');
    }
  };

  const handleRejectBid = async (bidId) => {
    try {
      await bidsAPI.reject(bidId);
      alert('Заявка відхилена');
      fetchBids();
    } catch (error) {
      alert(error.response?.data?.message || 'Помилка');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!confirm(`Змінити статус проєкту на "${newStatus === 'completed' ? 'Завершений' : 'Скасований'}"?`)) {
      return;
    }
    try {
      await projectsAPI.updateStatus(id, newStatus);
      alert('Статус проєкту оновлено!');
      fetchProject();
    } catch (error) {
      alert(error.response?.data?.message || 'Помилка оновлення статусу');
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-300">Завантаження...</div>;
  if (!project) return <div className="text-center py-12 text-gray-300">Проєкт не знайдено</div>;

  const isOwner = user?.id === project.client_id;
  const isFreelancer = user?.role === 'freelancer';
  const isAssignedFreelancer = isFreelancer && user?.id === project.freelancer_id;
  const canBid = isFreelancer && project.status === 'open';
  const canManageStatus = isOwner || isAssignedFreelancer;
  const canAccessChat = (isOwner || isAssignedFreelancer) && project.freelancer_id;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-8">
      <div className="bg-dark-card p-6 rounded-lg shadow mb-6">
        <h1 className="text-3xl font-bold mb-4 text-white">{project.title}</h1>
        <p className="text-gray-300 mb-6">{project.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="text-gray-300">
            <span className="font-semibold text-white">Бюджет:</span> {project.budget} грн
          </div>
          <div className="text-gray-300">
            <span className="font-semibold text-white">Категорія:</span> {project.category}
          </div>
          <div className="text-gray-300">
            <span className="font-semibold text-white">Статус:</span>
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              project.status === 'open' ? 'bg-green-900/30 text-green-400' :
              project.status === 'in_progress' ? 'bg-primary/20 text-primary' :
              project.status === 'completed' ? 'bg-purple-900/30 text-purple-400' :
              project.status === 'cancelled' ? 'bg-red-900/30 text-red-400' :
              'bg-gray-700 text-gray-300'
            }`}>
              {project.status === 'open' ? 'Відкритий' :
               project.status === 'in_progress' ? 'В роботі' :
               project.status === 'completed' ? 'Завершений' :
               project.status === 'cancelled' ? 'Скасований' : project.status}
            </span>
          </div>
          <div className="text-gray-300">
            <span className="font-semibold text-white">Заявок:</span> {project.bids_count || 0}
          </div>
        </div>

        {/* Кнопка відкрити чат */}
        {canAccessChat && (
          <Link
            href={`/chat/${project.id}`}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 mt-4 flex items-center justify-center gap-2 font-semibold transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Відкрити чат
          </Link>
        )}

        {/* Кнопки управління статусом (для власника та виконавця) */}
        {canManageStatus && project.status !== 'completed' && project.status !== 'cancelled' && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            {project.status === 'in_progress' && (
              <button
                onClick={() => handleUpdateStatus('completed')}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Позначити виконаним
              </button>
            )}
            {(project.status === 'open' || project.status === 'in_progress') && isOwner && (
              <button
                onClick={() => handleUpdateStatus('cancelled')}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Скасувати проєкт
              </button>
            )}
          </div>
        )}

        {/* Кнопка подати заявку (для фрілансерів) */}
        {canBid && !showBidForm && (
          <button
            onClick={() => setShowBidForm(true)}
            className="w-full bg-primary text-dark font-semibold py-2 rounded-lg hover:bg-primary-dark mt-4 transition-colors"
          >
            Подати заявку
          </button>
        )}
      </div>

      {/* Форма подачі заявки */}
      {showBidForm && canBid && (
        <div className="bg-dark-card p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4 text-white">Подати заявку</h2>
          <form onSubmit={handleSubmitBid} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Ваша ціна (грн)</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                value={bidData.amount}
                onChange={(e) => setBidData({...bidData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Термін виконання (днів)</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                value={bidData.deliveryTime}
                onChange={(e) => setBidData({...bidData, deliveryTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Супровідний лист</label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-2 bg-dark-lighter border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary"
                value={bidData.coverLetter}
                onChange={(e) => setBidData({...bidData, coverLetter: e.target.value})}
                placeholder="Розкажіть чому ви підходите для цього проєкту..."
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary text-dark font-semibold py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Відправити заявку
              </button>
              <button
                type="button"
                onClick={() => setShowBidForm(false)}
                className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список заявок (для власника проєкту) */}
      {isOwner && bids.length > 0 && (
        <div className="bg-dark-card p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4 text-white">Заявки ({bids.length})</h2>
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid.id} className="border border-gray-700 p-4 rounded-lg bg-dark-lighter">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                  <div>
                    <h3 className="font-semibold text-white">{bid.freelancer?.name}</h3>
                    <p className="text-sm text-gray-400">
                      Рейтинг: {bid.freelancer?.rating || 0} ⭐
                      ({bid.freelancer?.reviews_count || 0} відгуків)
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-bold text-lg text-primary">{bid.amount} грн</p>
                    <p className="text-sm text-gray-400">{bid.delivery_time} днів</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-3">{bid.cover_letter}</p>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className={`px-3 py-1 rounded text-sm w-fit ${
                    bid.status === 'pending' ? 'bg-yellow-900/30 text-yellow-400' :
                    bid.status === 'accepted' ? 'bg-green-900/30 text-green-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    {bid.status === 'pending' ? 'Очікується' :
                     bid.status === 'accepted' ? 'Прийнято' : 'Відхилено'}
                  </span>
                  {bid.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptBid(bid.id)}
                        className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition-colors"
                      >
                        Прийняти
                      </button>
                      <button
                        onClick={() => handleRejectBid(bid.id)}
                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition-colors"
                      >
                        Відхилити
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
