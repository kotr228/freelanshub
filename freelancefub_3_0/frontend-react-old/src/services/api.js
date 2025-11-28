import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Додати токен до кожного запиту
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Users API
export const usersAPI = {
  getProfile: (id) => api.get(`/users/${id}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getFreelancers: (params) => api.get('/users/freelancers', { params }),
};

// Projects API
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getMyClientProjects: () => api.get('/projects/my/client'),
  getMyFreelancerProjects: () => api.get('/projects/my/freelancer'),
  updateStatus: (id, status) => api.put(`/projects/${id}/status`, { status }),
};

// Bids API
export const bidsAPI = {
  create: (data) => api.post('/bids', data),
  getProjectBids: (projectId) => api.get(`/bids/project/${projectId}`),
  getMyBids: () => api.get('/bids/my'),
  accept: (id) => api.put(`/bids/${id}/accept`),
  reject: (id) => api.put(`/bids/${id}/reject`),
};

// Reviews API
export const reviewsAPI = {
  create: (data) => api.post('/reviews', data),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
  getProjectReviews: (projectId) => api.get(`/reviews/project/${projectId}`),
};

// Messages API
export const messagesAPI = {
  getMessages: (projectId) => api.get(`/messages/${projectId}`),
  sendMessage: (data) => api.post('/messages', data),
  getUnread: () => api.get('/messages/unread'),
};

export default api;
