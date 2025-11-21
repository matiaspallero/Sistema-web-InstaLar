import { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import SedeCard from '../components/SedeCard';
import { api } from '../services/api';

function Sedes() {
  const [sedes, setSedes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingSede, setEditingSede] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cliente_id: '',
    direccion: '',
    ciudad: '',
    equipos: 0,
    estado: 'activo'
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [sedesData, clientesData] = await Promise.all([
        api.sedes.getAll(),
        api.clientes.getAll()
      ]);
      setSedes(sedesData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const filteredSedes = sedes.filter(sede =>
    sede.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sede.clientes?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (sede) => {
    setEditingSede(sede);
    setFormData({
      nombre: sede.nombre,
      cliente_id: sede.cliente_id,
      direccion: sede.direccion || '',
      ciudad: sede.ciudad || '',
      equipos: sede.equipos || 0,
      estado: sede.estado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta sede?')) {
      try {
        await api.sedes.delete(id);
        setSedes(sedes.filter(s => s.id !== id));
        alert('Sede eliminada correctamente');
      } catch (error) {
        console.error('Error al eliminar sede:', error);
        alert('Error al eliminar la sede');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSede) {
        const updated = await api.sedes.update(editingSede.id, formData);
        setSedes(sedes.map(s => s.id === editingSede.id ? updated : s));
        alert('Sede actualizada correctamente');
      } else {
        const newSede = await api.sedes.create(formData);
        setSedes([...sedes, newSede]);
        alert('Sede creada correctamente');
      }
      
      handleCloseModal();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar sede:', error);
      alert('Error al guardar la sede');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingSede(null);
    setFormData({
      nombre: '',
      cliente_id: '',
      direccion: '',
      ciudad: '',
      equipos: 0,
      estado: 'activo'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Sedes</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md cursor-pointer"
        >
          <FaPlus /> Nueva Sede
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar sedes por nombre o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {filteredSedes.map((sede) => (
          <SedeCard 
            key={sede.id} 
            sede={{
              ...sede,
              cliente: sede.clientes?.nombre || 'Sin cliente'
            }}
            onEdit={() => handleEdit(sede)}
            onDelete={() => handleDelete(sede.id)}
          />
        ))}
      </div>

      {filteredSedes.length === 0 && (
        <div className="bg-white rounded-xl shadow-md text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron sedes</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-linear-to-r from-indigo-600 to-purple-700 p-6 text-white">
              <h3 className="text-2xl font-bold">
                {editingSede ? 'Editar Sede' : 'Nueva Sede'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la Sede *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Sede Central"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select
                    required
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({...formData, cliente_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Lima"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cantidad de Equipos
                  </label>
                  <input
                    type="number"
                    value={formData.equipos}
                    onChange={(e) => setFormData({...formData, equipos: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="activo">Activo</option>
                    <option value="mantenimiento-pendiente">Mantenimiento Pendiente</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dirección
                </label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Av. Principal 123, Piso 3"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer"
                >
                  {editingSede ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sedes;