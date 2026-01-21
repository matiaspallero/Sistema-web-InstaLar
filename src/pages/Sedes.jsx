import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaMapMarkerAlt, FaSave, FaTimes, FaBuilding, FaCity } from 'react-icons/fa';
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

      const listaSedes = Array.isArray(sedesData) ? sedesData : (sedesData.data || []);
      const listaClientes = Array.isArray(clientesData) ? clientesData : (clientesData.data || []);

      setSedes(listaSedes);
      setClientes(listaClientes);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
      setSedes([]);
      setClientes([]);
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
        // Ajuste por si updated viene con { data: ... }
        const updatedData = updated.data || updated;
        setSedes(sedes.map(s => s.id === editingSede.id ? updatedData : s));
        alert('Sede actualizada correctamente');
      } else {
        const newSede = await api.sedes.create(formData);
        // Ajuste por si newSede viene con { data: ... }
        const newSedeData = newSede.data || newSede;
        setSedes([...sedes, newSedeData]);
        alert('Sede creada correctamente');
      }
      
      handleCloseModal();
      cargarDatos(); // Recargar para asegurar relaciones
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
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Estilizado */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" /> Gestión de Sedes
          </h2>
          <p className="text-gray-500 text-sm">Administra las ubicaciones de tus clientes</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-md shadow-blue-200"
          >
            <FaPlus size={20}/> Nueva Sede
          </button>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="relative w-full">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, dirección o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSedes.map((sede) => (
          <SedeCard 
            key={sede.id} 
            sede={{
              ...sede,
              // Adaptador visual para que la card no se rompa
              cliente: sede.clientes?.nombre || 'Sin cliente',
              proximoMantenimiento: 'Pendiente', 
              ultimoMantenimiento: sede.updated_at ? new Date(sede.updated_at).toLocaleDateString() : '-'
            }}
            onEdit={() => handleEdit(sede)}
            onDelete={() => handleDelete(sede.id)}
          />
        ))}
      </div>

      {/* Estado Vacío */}
      {filteredSedes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm">
          <FaBuilding className="mx-auto text-4xl text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No se encontraron sedes</h3>
          <p className="text-sm text-gray-400">Intenta ajustar la búsqueda o agrega una nueva ubicación.</p>
        </div>
      )}

      {/* Modal Profesional */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header del Modal */}
            <div className="bg-blue-600 p-4 md:p-6 text-white flex justify-between items-center shrink-0">
              <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                {editingSede ? <><FaMapMarkerAlt /> Editar Sede</> : <><FaPlus /> Nueva Sede</>}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-white/80 hover:text-white transition cursor-pointer p-1 rounded-full hover:bg-white/10"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            {/* Formulario */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              
              {/* Fila 1: Nombre y Cliente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nombre del lugar *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Ej: Oficina Central"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Cliente Asociado *
                  </label>
                  <select
                    required
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({...formData, cliente_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Seleccione un cliente...</option>
                    {Array.isArray(clientes) && clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fila 2: Ciudad y Equipos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Ciudad
                  </label>
                  <div className="relative">
                    <FaCity className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      value={formData.ciudad}
                      onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ej: San Miguel"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
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
              </div>

              {/* Estado */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Estado Operativo
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData({...formData, estado: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="activo">🟢 Activo</option>
                  <option value="mantenimiento-pendiente">🟡 Mantenimiento Pendiente</option>
                  <option value="inactivo">🔴 Inactivo</option>
                </select>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Dirección Completa
                </label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                  placeholder="Calle, Número, Piso, Referencias..."
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold cursor-pointer shadow-lg shadow-blue-200 flex justify-center items-center gap-2"
                >
                  <FaSave /> {editingSede ? 'Guardar Cambios' : 'Registrar Sede'}
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