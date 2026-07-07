import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ==================== USER API ====================

export const userAPI = {
  register: async (userData) => {
    const response = await api.post('/api/users/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/api/users/login', credentials);
    return response.data;
  },

  getUser: async (userId) => {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },
};

// ==================== CROP API ====================

export const cropAPI = {
  getAllCrops: async () => {
    const response = await api.get('/api/crops');
    return response.data;
  },

  getCropById: async (cropId) => {
    const response = await api.get(`/api/crops/${cropId}`);
    return response.data;
  },

  searchCrops: async (query, season) => {
    const params = {};
    if (query) params.q = query;
    if (season) params.season = season;
    const response = await api.get('/api/crops/search', { params });
    return response.data;
  },

  addCrop: async (cropData) => {
    const response = await api.post('/api/crops', cropData);
    return response.data;
  },
};

// ==================== CHAT API ====================

export const chatAPI = {
  getMessages: async (userId) => {
    const response = await api.get('/api/chat/messages', { params: { userId } });
    return response.data;
  },

  sendMessage: async (messageData) => {
    const response = await api.post('/api/chat/messages', messageData);
    return response.data;
  },

  deleteMessage: async (messageId) => {
    const response = await api.delete(`/api/chat/messages/${messageId}`);
    return response.data;
  },
};

// ==================== HEALTH API ====================

export const healthAPI = {
  check: async () => {
    const response = await api.get('/api/health');
    return response.data;
  },
};

export default api;
