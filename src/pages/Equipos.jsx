import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTools, FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const Equipos = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mostrarNotificacion } = useApp();

  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');

  useEffect(() => {
    cargarEquipos();
  }, []);

  const cargarEquipos = async () => {
    try {
      setLoading(true);
      const res = await api.equipos.getAll();
      setEquipos(Array.isArray(res) ? res : res.data || []);
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error cargando equipos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este equipo?')) return;

    try {
      await api.equipos.delete(id);
      setEquipos(equipos.filter(e => e.id !== id));
      mostrarNotificacion('Equipo eliminado', 'success');
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error al eliminar', 'error');
    }
  };

  // Filtrado
  const equiposFiltrados = equipos.filter(equipo => {
    const coincideSearch = 
      equipo.marca?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      equipo.serie?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const coincideEstado = !filtroEstado || equipo.estado === filtroEstado;
    
    return coincideSearch && coincideEstado;
  });

  const puedeEditar = ['admin', 'tecnico'].includes(user?.rol);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Cargando equipos...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3 mb-2">
              <FaTools className="text-blue-600" /> Gestión de Equipos
            </h1>
            <p className="text-gray-600">Total: {equiposFiltrados.length} equipos</p>
          </div>
          
          {puedeEditar && (
            <button
              onClick={() => navigate('/equipos/nuevo')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition shadow-lg cursor-pointer"
            >
              <FaPlus /> Nuevo Equipo
            </button>
          )}
        </div>

        {/* Buscador y Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Búsqueda */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por marca, modelo o serie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Filtro Estado */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-400" />
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="descartado">Descartado</option>
              </select>
            </div>

            {/* Limpiar filtros */}
            <button
              onClick={() => {
                setSearchTerm('');
                setFiltroEstado('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer font-semibold"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Tabla */}
        {equiposFiltrados.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Marca</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Modelo</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Serie</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Frigorías</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Cliente</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-gray-700">Sede</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">Estado</th>
                    <th className="px-6 py-3 text-center text-sm font-bold text-gray-700">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {equiposFiltrados.map((equipo) => (
                    <tr key={equipo.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                        {equipo.marca}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {equipo.modelo}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        {equipo.serie}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {equipo.frigorias} F
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {equipo.clientes?.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {equipo.sedes?.nombre}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          equipo.estado === 'activo'
                            ? 'bg-green-100 text-green-700'
                            : equipo.estado === 'inactivo'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {equipo.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2 flex justify-center">
                        <button
                          onClick={() => navigate(`/equipos/${equipo.id}`)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition cursor-pointer"
                          title="Ver detalles"
                        >
                          <FaEye />
                        </button>
                        {puedeEditar && (
                          <>
                            <button
                              onClick={() => navigate(`/equipos/${equipo.id}/editar`)}
                              className="p-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-600 rounded-lg transition cursor-pointer"
                              title="Editar"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleEliminar(equipo.id)}
                              className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition cursor-pointer"
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FaTools size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-600 text-lg font-semibold">No hay equipos para mostrar</p>
            <p className="text-gray-500 mt-1">
              {searchTerm || filtroEstado 
                ? 'Intenta con otros criterios de búsqueda'
                : 'Comienza agregando el primer equipo'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Equipos;