import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { api } from '../services/api';

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [editingServicio, setEditingServicio] = useState(null);
  const [formData, setFormData] = useState({
    tipo: '',
    cliente_id: '',
    sede_id: '',
    tecnico_id: '',
    equipo: '',
    marca: '',
    modelo: '',
    fecha: '',
    hora: '',
    estado: 'pendiente',
    descripcion: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [serviciosData, clientesData, sedesData, tecnicosData] = await Promise.all([
        api.servicios.getAll(),
        api.clientes.getAll(),
        api.sedes.getAll(),
        api.tecnicos.getAll()
      ]);
      setServicios(serviciosData);
      setClientes(clientesData);
      setSedes(sedesData);
      setTecnicos(tecnicosData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      alert('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const filteredServicios = servicios.filter(servicio => {
    const matchSearch = servicio.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       servicio.clientes?.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === 'todos' || servicio.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const handleEdit = (servicio) => {
    setEditingServicio(servicio);
    setFormData({
      tipo: servicio.tipo,
      cliente_id: servicio.cliente_id,
      sede_id: servicio.sede_id,
      tecnico_id: servicio.tecnico_id || '',
      equipo: servicio.equipo || '',
      marca: servicio.marca || '',
      modelo: servicio.modelo || '',
      fecha: servicio.fecha,
      hora: servicio.hora,
      estado: servicio.estado,
      descripcion: servicio.descripcion || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este servicio?')) {
      try {
        await api.servicios.delete(id);
        setServicios(servicios.filter(s => s.id !== id));
        alert('Servicio eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
        alert('Error al eliminar el servicio');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingServicio) {
        const updated = await api.servicios.update(editingServicio.id, formData);
        setServicios(servicios.map(s => s.id === editingServicio.id ? updated : s));
        alert('Servicio actualizado correctamente');
      } else {
        const newServicio = await api.servicios.create(formData);
        setServicios([...servicios, newServicio]);
        alert('Servicio creado correctamente');
      }
      
      handleCloseModal();
      cargarDatos();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      alert('Error al guardar el servicio');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingServicio(null);
    setFormData({
      tipo: '',
      cliente_id: '',
      sede_id: '',
      tecnico_id: '',
      equipo: '',
      marca: '',
      modelo: '',
      fecha: '',
      hora: '',
      estado: 'pendiente',
      descripcion: ''
    });
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'completado': 'bg-green-100 text-green-800',
      'en-proceso': 'bg-yellow-100 text-yellow-800',
      'pendiente': 'bg-red-100 text-red-800',
      'cancelado': 'bg-gray-100 text-gray-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      'completado': 'Completado',
      'en-proceso': 'En Proceso',
      'pendiente': 'Pendiente',
      'cancelado': 'Cancelado'
    };
    return textos[estado] || estado;
  };

  const sedesFiltradas = sedes.filter(sede => sede.cliente_id === formData.cliente_id);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Gestión de Servicios</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
        >
          <FaPlus /> Nuevo Servicio
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer text-sm md:text-base"
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en-proceso">En Proceso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla para Desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-linear-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Tipo</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Sede</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Técnico</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-bold uppercase">Estado</th>
                <th className="px-6 py-4 text-center text-sm font-bold uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredServicios.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{servicio.tipo}</td>
                  <td className="px-6 py-4 text-gray-600">{servicio.clientes?.nombre || 'Sin cliente'}</td>
                  <td className="px-6 py-4 text-gray-600">{servicio.sedes?.nombre || 'Sin sede'}</td>
                  <td className="px-6 py-4 text-gray-600">{servicio.tecnicos?.nombre || 'Sin asignar'}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(servicio.fecha).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(servicio.estado)}`}>
                      {getEstadoTexto(servicio.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button 
                        onClick={() => handleEdit(servicio)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(servicio.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors"
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
      </div>

      {/* Cards para Móvil/Tablet */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredServicios.map((servicio) => (
          <div key={servicio.id} className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">{servicio.tipo}</h3>
                <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${getEstadoBadge(servicio.estado)}`}>
                  {getEstadoTexto(servicio.estado)}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm mb-3">
              <p className="text-gray-600">
                <span className="font-semibold">Cliente:</span> {servicio.clientes?.nombre || 'Sin cliente'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Sede:</span> {servicio.sedes?.nombre || 'Sin sede'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Técnico:</span> {servicio.tecnicos?.nombre || 'Sin asignar'}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Fecha:</span> {new Date(servicio.fecha).toLocaleDateString('es-ES')}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Hora:</span> {servicio.hora}
              </p>
            </div>

            <div className="flex gap-2 pt-3 border-t">
              <button 
                onClick={() => handleEdit(servicio)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(servicio.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition-colors font-medium text-sm"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServicios.length === 0 && (
        <div className="bg-white rounded-xl shadow-md text-center py-12 mt-6">
          <p className="text-gray-500 text-base md:text-lg">No se encontraron servicios</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="bg-linear-to-r from-blue-600 to-blue-700 p-4 md:p-6 text-white sticky top-0 z-10">
              <h3 className="text-xl md:text-2xl font-bold">
                {editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Servicio *
                  </label>
                  <select
                    required
                    value={formData.tipo}
                    onChange={(e) => setFormData({...formData, tipo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione un tipo</option>
                    <option value="Mantenimiento Preventivo">Mantenimiento Preventivo</option>
                    <option value="Reparación">Reparación</option>
                    <option value="Instalación">Instalación</option>
                    <option value="Revisión">Revisión</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select
                    required
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({...formData, cliente_id: e.target.value, sede_id: ''})}
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
                    Sede *
                  </label>
                  <select
                    required
                    value={formData.sede_id}
                    onChange={(e) => setFormData({...formData, sede_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.cliente_id}
                  >
                    <option value="">Seleccione una sede</option>
                    {sedesFiltradas.map(sede => (
                      <option key={sede.id} value={sede.id}>
                        {sede.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Técnico
                  </label>
                  <select
                    value={formData.tecnico_id}
                    onChange={(e) => setFormData({...formData, tecnico_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sin asignar</option>
                    {tecnicos.map(tecnico => (
                      <option key={tecnico.id} value={tecnico.id}>
                        {tecnico.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Equipo
                  </label>
                  <input
                    type="text"
                    value={formData.equipo}
                    onChange={(e) => setFormData({...formData, equipo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Split 12000 BTU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="LG"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Modelo
                  </label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Inverter V"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hora *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.hora}
                    onChange={(e) => setFormData({...formData, hora: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    <option value="pendiente">Pendiente</option>
                    <option value="en-proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Detalles del servicio..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                  {editingServicio ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Servicios;