import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API functions
export const apiService = {
  // Test API connection
  testConnection: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit contact form
  submitContact: async (formData) => {
    try {
      const response = await api.post('/contact', formData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit booking
  submitBooking: async (bookingData) => {
    try {
      const response = await api.post('/booking', bookingData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get concert information
  getConcertInfo: async () => {
    try {
      const response = await api.get('/concert-info');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get booking statistics
  getBookingStats: async () => {
    try {
      const response = await api.get('/booking-stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all contacts (admin)
  getContacts: async () => {
    try {
      const response = await api.get('/contacts');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all bookings (admin)
  getBookings: async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Status check (from original template)
  createStatusCheck: async (clientName) => {
    try {
      const response = await api.post('/status', { clientName });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStatusChecks: async () => {
    try {
      const response = await api.get('/status');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;