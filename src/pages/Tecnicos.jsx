import { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import TecnicoCard from '../components/TecnicoCard';
import { api } from '../services/api';

function Tecnicos() {
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTecnico, setEditingTecnico] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    especialidad: '',
    telefono: '',
    email: '',
    estado: 'disponible'
  });

  useEffect(() => {
    cargarTecnicos();
  }, []);

  const cargarTecnicos = async () => {
    try {
      setLoading(true);
      const data = await api.tecnicos.getAll();
      setTecnicos(Array.isArray(data) ? data : (data.tecnicos || data.data || []));
    } catch (error) {
      console.error('Error al cargar técnicos:', error);
      alert('Error al cargar los técnicos');
      setTecnicos([]); // Establecer array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  const filteredTecnicos = Array.isArray(tecnicos) 
    ? tecnicos.filter(tecnico =>
        tecnico.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tecnico.especialidad?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleEdit = (tecnico) => {
    setEditingTecnico(tecnico);
    setFormData({
      nombre: tecnico.nombre,
      especialidad: tecnico.especialidad || '',
      telefono: tecnico.telefono || '',
      email: tecnico.email,
      estado: tecnico.estado
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este técnico?')) {
      try {
        await api.tecnicos.delete(id);
        setTecnicos(tecnicos.filter(t => t.id !== id));
        alert('Técnico eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar técnico:', error);
        alert('Error al eliminar el técnico');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingTecnico) {
        // Actualizar técnico existente
        const updated = await api.tecnicos.update(editingTecnico.id, formData);
        setTecnicos(tecnicos.map(t => t.id === editingTecnico.id ? updated : t));
        alert('Técnico actualizado correctamente');
      } else {
        // Crear nuevo técnico
        const newTecnico = await api.tecnicos.create(formData);
        setTecnicos([...tecnicos, newTecnico]);
        alert('Técnico creado correctamente');
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar técnico:', error);
      alert('Error al guardar el técnico');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTecnico(null);
    setFormData({
      nombre: '',
      especialidad: '',
      telefono: '',
      email: '',
      estado: 'disponible'
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
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Técnicos</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md cursor-pointer"
        >
          <FaPlus /> Nuevo Técnico
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar técnicos por nombre o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredTecnicos.map((tecnico) => (
          <TecnicoCard 
            key={tecnico.id} 
            tecnico={tecnico}
            onEdit={() => handleEdit(tecnico)}
            onDelete={() => handleDelete(tecnico.id)}
          />
        ))}
      </div>

      {filteredTecnicos.length === 0 && (
        <div className="bg-white rounded-xl shadow-md text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron técnicos</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-linear-to-r from-blue-600 to-blue-700 p-6 text-white">
              <h3 className="text-2xl font-bold">
                {editingTecnico ? 'Editar Técnico' : 'Nuevo Técnico'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Especialidad
                </label>
                <input
                  type="text"
                  value={formData.especialidad}
                  onChange={(e) => setFormData({...formData, especialidad: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Instalación y Mantenimiento"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tecnico@instalar.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={formData.telefono}
                  onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="987654321"
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
                  <option value="disponible">Disponible</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="inactivo">Inactivo</option>
                </select>
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
                  {editingTecnico ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tecnicos;