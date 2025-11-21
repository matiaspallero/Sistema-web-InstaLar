const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error en el servidor' }));
    throw new Error(error.message || 'Error en la petición');
  }
  return response.json();
};

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    }
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const api = {
  auth: {
    login: async (credentials) => {
      try {
        return await request('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials)
        });
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    register: async (userData) => {
      try {
        return await request('/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData)
        });
      } catch (error) {
        return { success: false, message: error.message };
      }
    },

    verifyToken: async (token) => {
      try {
        return await request('/auth/verify', {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        return { valid: false };
      }
    },

    logout: async () => {
      try {
        return await request('/auth/logout', { method: 'POST' });
      } catch (error) {
        return { success: false };
      }
    }
  },

  users: {
    getProfile: async () => {
      return await request('/users/profile');
    },

    updateProfile: async (data) => {
      return await request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    }
  }
};