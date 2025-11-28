import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { projectsAPI, bidsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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

  if (loading) return <div className="text-center py-12">Завантаження...</div>;
  if (!project) return <div className="text-center py-12">Проєкт не знайдено</div>;

  const isOwner = user?.id === project.client_id;
  const isFreelancer = user?.role === 'freelancer';
  const canBid = isFreelancer && project.status === 'open';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
        <p className="text-gray-700 mb-6">{project.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-semibold">Бюджет:</span> {project.budget} грн
          </div>
          <div>
            <span className="font-semibold">Категорія:</span> {project.category}
          </div>
          <div>
            <span className="font-semibold">Статус:</span>
            <span className={`ml-2 px-2 py-1 rounded text-sm ${
              project.status === 'open' ? 'bg-green-100 text-green-800' :
              project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status === 'open' ? 'Відкритий' :
               project.status === 'in_progress' ? 'В роботі' :
               project.status === 'completed' ? 'Завершений' : project.status}
            </span>
          </div>
          <div>
            <span className="font-semibold">Заявок:</span> {project.bids_count || 0}
          </div>
        </div>

        {/* Кнопка подати заявку (для фрілансерів) */}
        {canBid && !showBidForm && (
          <button
            onClick={() => setShowBidForm(true)}
            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-600 mt-4"
          >
            Подати заявку
          </button>
        )}
      </div>

      {/* Форма подачі заявки */}
      {showBidForm && canBid && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-2xl font-bold mb-4">Подати заявку</h2>
          <form onSubmit={handleSubmitBid} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Ваша ціна (грн)</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 border rounded-lg"
                value={bidData.amount}
                onChange={(e) => setBidData({...bidData, amount: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Термін виконання (днів)</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 border rounded-lg"
                value={bidData.deliveryTime}
                onChange={(e) => setBidData({...bidData, deliveryTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Супровідний лист</label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-2 border rounded-lg"
                value={bidData.coverLetter}
                onChange={(e) => setBidData({...bidData, coverLetter: e.target.value})}
                placeholder="Розкажіть чому ви підходите для цього проєкту..."
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-blue-600"
              >
                Відправити заявку
              </button>
              <button
                type="button"
                onClick={() => setShowBidForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
              >
                Скасувати
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Список заявок (для власника проєкту) */}
      {isOwner && bids.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Заявки ({bids.length})</h2>
          <div className="space-y-4">
            {bids.map((bid) => (
              <div key={bid.id} className="border p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{bid.freelancer?.name}</h3>
                    <p className="text-sm text-gray-600">
                      Рейтинг: {bid.freelancer?.rating || 0} ⭐
                      ({bid.freelancer?.reviews_count || 0} відгуків)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{bid.amount} грн</p>
                    <p className="text-sm text-gray-600">{bid.delivery_time} днів</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{bid.cover_letter}</p>
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded text-sm ${
                    bid.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    bid.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {bid.status === 'pending' ? 'Очікується' :
                     bid.status === 'accepted' ? 'Прийнято' : 'Відхилено'}
                  </span>
                  {bid.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAcceptBid(bid.id)}
                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                      >
                        Прийняти
                      </button>
                      <button
                        onClick={() => handleRejectBid(bid.id)}
                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
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
