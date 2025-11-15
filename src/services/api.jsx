const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`${API_URL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Clientes
  async getClientes() {
    return this.request('/clientes');
  }

  async getCliente(id) {
    return this.request(`/clientes/${id}`);
  }

  async createCliente(data) {
    return this.request('/clientes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCliente(id, data) {
    return this.request(`/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCliente(id) {
    return this.request(`/clientes/${id}`, {
      method: 'DELETE',
    });
  }

  // Servicios
  async getServicios() {
    return this.request('/servicios');
  }

  async createServicio(data) {
    return this.request('/servicios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateServicio(id, data) {
    return this.request(`/servicios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteServicio(id) {
    return this.request(`/servicios/${id}`, {
      method: 'DELETE',
    });
  }

  // Técnicos
  async getTecnicos() {
    return this.request('/tecnicos');
  }

  async createTecnico(data) {
    return this.request('/tecnicos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTecnico(id, data) {
    return this.request(`/tecnicos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTecnico(id) {
    return this.request(`/tecnicos/${id}`, {
      method: 'DELETE',
    });
  }

  // Sedes
  async getSedes() {
    return this.request('/sedes');
  }

  async createSede(data) {
    return this.request('/sedes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateSede(id, data) {
    return this.request(`/sedes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteSede(id) {
    return this.request(`/sedes/${id}`, {
      method: 'DELETE',
    });
  }

  // Reportes
  async getReportes(fechaInicio, fechaFin, tipo) {
    return this.request(`/reportes?inicio=${fechaInicio}&fin=${fechaFin}&tipo=${tipo}`);
  }

  async exportarReporte(tipo, formato) {
    return this.request(`/reportes/exportar?tipo=${tipo}&formato=${formato}`);
  }
}

export default new ApiService();