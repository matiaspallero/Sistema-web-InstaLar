const API_URL = import.meta.env.VITE_API_URL = 'https://instalar.netlify.app/api';

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
  },

  // Endpoints para clientes
  clientes: {
    getAll: async () => {
      return await request('/clientes');
    },

    getById: async (id) => {
      return await request(`/clientes/${id}`);
    },

    create: async (data) => {
      return await request('/clientes', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    update: async (id, data) => {
      return await request(`/clientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    delete: async (id) => {
      return await request(`/clientes/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Endpoints para servicios
  servicios: {
    getAll: async () => {
      return await request('/servicios');
    },

    getById: async (id) => {
      return await request(`/servicios/${id}`);
    },

    create: async (data) => {
      return await request('/servicios', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    getByUser: async (userId) => {
      return await request(`/servicios/usuario/${userId}`);
    },

    solicitar: async (data) => {
      return await request('/servicios/solicitar', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    asignarTecnico: async (id, tecnico_id) => {
      return await request(`/servicios/${id}/asignar-tecnico`, {
        method: 'PATCH',
        body: JSON.stringify({ tecnico_id })
      });
    },

    update: async (id, data) => {
      return await request(`/servicios/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    delete: async (id) => {
      return await request(`/servicios/${id}`, {
        method: 'DELETE'
      });
    },

    updateEstado: async (id, estado) => {
      return await request(`/servicios/${id}/estado`, {
        method: 'PATCH',
        body: JSON.stringify({ estado })
      });
    },
  },

  // Endpoints para técnicos
  tecnicos: {
    getAll: async () => {
      return await request('/tecnicos');
    },

    getById: async (id) => {
      return await request(`/tecnicos/${id}`);
    },

    create: async (data) => {
      return await request('/tecnicos', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    update: async (id, data) => {
      return await request(`/tecnicos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    delete: async (id) => {
      return await request(`/tecnicos/${id}`, {
        method: 'DELETE'
      });
    },

    getMisTrabajos: async () => {
    return await request(`/servicios/tecnico/mis-trabajos`);
    },
  },

  // Endpoints para sedes
  sedes: {
    getAll: async () => {
      return await request('/sedes');
    },

    getById: async (id) => {
      return await request(`/sedes/${id}`);
    },

    getByCliente: async (clienteId) => {
      return await request(`/sedes/cliente/${clienteId}`);
    },

    getByUser: async (userId) => {
      return await request(`/sedes/usuario/${userId}`);
    },

    create: async (data) => {
      return await request('/sedes', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    update: async (id, data) => {
      return await request(`/sedes/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
    },

    delete: async (id) => {
      return await request(`/sedes/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // --- SOLICITUDES (Agrega este bloque nuevo) ---
  solicitudes: {
    // Obtener todas (para el Admin/Cliente)
    getAll: async () => {
      const response = await request('/solicitudes');
      // A veces el backend devuelve { success: true, data: [...] } y otras veces el array directo
      return response.data || response; 
    },

    // Crear nueva solicitud (Cliente)
    create: async (data) => {
      return await request('/solicitudes', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },

    // ASIGNAR TÉCNICO (La función que pediste)
    asignarTecnico: async (id, tecnico_id) => {
      return await request(`/solicitudes/${id}/asignar-tecnico`, {
        method: 'PATCH', // Coincide con tu routes.js
        body: JSON.stringify({ tecnico_id })
      });
    },

    // Eliminar solicitud
    delete: async (id) => {
      return await request(`/solicitudes/${id}`, {
        method: 'DELETE'
      });
    }
  },

  // Endpoints para reportes
  reportes: {
    getEstadisticas: async () => {
      return await request('/reportes/estadisticas');
    },

    getServiciosPorPeriodo: async (inicio, fin) => {
      return await request(`/reportes/servicios?inicio=${inicio}&fin=${fin}`);
    },

    getServiciosPorTecnico: async (tecnicoId) => {
      return await request(`/reportes/tecnicos/${tecnicoId}/servicios`);
    }
  }
};