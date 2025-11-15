import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaTable, FaTh } from 'react-icons/fa';
import ServicioCard from '../components/ServicioCard';

function Servicios() {
  const [servicios, setServicios] = useState([
    {
      id: 1,
      tipo: 'Mantenimiento Preventivo',
      cliente: 'Empresa ABC',
      sede: 'Sede Central',
      tecnico: 'Juan Pérez',
      fecha: '2024-11-15',
      hora: '10:00',
      estado: 'programado',
      equipo: 'Split 12000 BTU',
      descripcion: 'Limpieza y revisión general'
    },
    {
      id: 2,
      tipo: 'Reparación',
      cliente: 'Hotel XYZ',
      sede: 'Recepción',
      tecnico: 'María García',
      fecha: '2024-11-14',
      hora: '14:00',
      estado: 'en-proceso',
      equipo: 'Cassette 24000 BTU',
      descripcion: 'Fuga de refrigerante'
    },
    {
      id: 3,
      tipo: 'Instalación',
      cliente: 'Oficinas Central',
      sede: 'Piso 3',
      tecnico: 'Carlos López',
      fecha: '2024-11-16',
      hora: '09:00',
      estado: 'pendiente',
      equipo: 'Split Inverter 18000 BTU',
      descripcion: 'Instalación nueva unidad'
    },
    {
      id: 4,
      tipo: 'Mantenimiento Correctivo',
      cliente: 'Empresa ABC',
      sede: 'Sala de Juntas',
      tecnico: 'Juan Pérez',
      fecha: '2024-11-13',
      hora: '11:00',
      estado: 'completado',
      equipo: 'VRF 36000 BTU',
      descripcion: 'Reemplazo de filtros y sensor'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [viewMode, setViewMode] = useState('table');

  const estados = ['todos', 'programado', 'en-proceso', 'completado', 'pendiente', 'cancelado'];

  const filteredServicios = servicios.filter(servicio => {
    const matchSearch = servicio.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       servicio.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       servicio.tecnico.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === 'todos' || servicio.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const handleEdit = (id) => {
    console.log('Editar servicio:', id);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este servicio?')) {
      setServicios(servicios.filter(s => s.id !== id));
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'programado': 'bg-blue-100 text-blue-800',
      'en-proceso': 'bg-yellow-100 text-yellow-800',
      'completado': 'bg-green-100 text-green-800',
      'pendiente': 'bg-orange-100 text-orange-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      'programado': 'Programado',
      'en-proceso': 'En Proceso',
      'completado': 'Completado',
      'pendiente': 'Pendiente',
      'cancelado': 'Cancelado'
    };
    return textos[estado] || estado;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Servicios</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <FaPlus /> Nuevo Servicio
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar servicios por cliente, tipo o técnico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              {estados.map(estado => (
                <option key={estado} value={estado}>
                  {estado === 'todos' ? 'Todos los Estados' : getEstadoTexto(estado)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium ${
              viewMode === 'table' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaTable /> Tabla
          </button>
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium ${
              viewMode === 'cards' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FaTh /> Tarjetas
          </button>
        </div>
      </div>

      {/* Vista de Tabla */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-linear-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Sede</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Técnico</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredServicios.map((servicio) => (
                  <tr key={servicio.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{servicio.tipo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{servicio.cliente}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{servicio.sede}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{servicio.tecnico}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      <div className="flex flex-col">
                        <span className="font-medium">{servicio.fecha}</span>
                        <span className="text-sm text-gray-500">{servicio.hora}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(servicio.estado)}`}>
                        {getEstadoTexto(servicio.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(servicio.id)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(servicio.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredServicios.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron servicios</p>
            </div>
          )}
        </div>
      )}

      {/* Vista de Tarjetas */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServicios.map((servicio) => (
            <ServicioCard 
              key={servicio.id} 
              servicio={servicio}
              onEdit={() => handleEdit(servicio.id)}
              onDelete={() => handleDelete(servicio.id)}
            />
          ))}
        </div>
      )}

      {viewMode === 'cards' && filteredServicios.length === 0 && (
        <div className="bg-white rounded-xl shadow-md text-center py-12">
          <p className="text-gray-500 text-lg">No se encontraron servicios</p>
        </div>
      )}
    </div>
  );
}

export default Servicios;