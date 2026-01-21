import { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFilter, FaTimes, FaSave } from 'react-icons/fa';
import { api } from '../services/api';
import { useApp } from '../context/AppContext'; // Para notificaciones bonitas
import Loading from '../components/Loading'; // Componente de carga
import ServicioCard from '../components/ServicioCard'; // Tu tarjeta de diseño

function Servicios() {
  const { mostrarNotificacion } = useApp();
  
  // --- ESTADOS (Tu lógica original) ---
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  
  // Edición
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
    estado: 'en-proceso',
    descripcion: ''
  });

  // --- EFECTOS Y CARGA ---
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

      // Blindaje de datos (por si vienen en .data o directo)
      setServicios(Array.isArray(serviciosData) ? serviciosData : (serviciosData.data || []));
      setClientes(Array.isArray(clientesData) ? clientesData : (clientesData.data || []));
      setSedes(Array.isArray(sedesData) ? sedesData : (sedesData.data || []));
      setTecnicos(Array.isArray(tecnicosData) ? tecnicosData : (tecnicosData.data || []));

    } catch (error) {
      console.error('Error al cargar datos:', error);
      mostrarNotificacion('Error al cargar los datos del sistema', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- FILTROS ---
  const filteredServicios = servicios.filter(servicio => {
    const matchSearch = 
      servicio.tipo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.clientes?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      servicio.equipo?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchEstado = filterEstado === 'todos' || servicio.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  // --- MANEJADORES (CRUD) ---
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
        mostrarNotificacion('Servicio eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
        mostrarNotificacion('Error al eliminar el servicio', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingServicio) {
        // Actualizar
        const res = await api.servicios.update(editingServicio.id, formData);
        const updated = res.data || res; // Adaptador por si la API devuelve {data: ...} o directo
        
        // Actualizamos la lista local manteniendo la estructura de relaciones (mockup visual inmediato)
        const listaActualizada = servicios.map(s => {
          if (s.id === editingServicio.id) {
             // Reconstruimos el objeto visualmente para que la Card no parpadee sin datos
             return {
                ...updated,
                clientes: clientes.find(c => c.id === formData.cliente_id),
                sedes: sedes.find(sede => sede.id === formData.sede_id),
                tecnicos: tecnicos.find(t => t.id === formData.tecnico_id)
             };
          }
          return s;
        });
        
        setServicios(listaActualizada);
        mostrarNotificacion('Servicio actualizado correctamente', 'success');
      } else {
        // Crear
        const res = await api.servicios.create(formData);
        mostrarNotificacion('Servicio creado correctamente', 'success');
        cargarDatos(); // Recargar para traer las relaciones completas (JOINs) del backend
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      mostrarNotificacion('Error al guardar el servicio', 'error');
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
      estado: 'en-proceso',
      descripcion: ''
    });
  };

  // Lógica de sedes dependientes (Tu código original)
  const sedesFiltradas = sedes.filter(sede => sede.cliente_id === formData.cliente_id);

  if (loading) return <Loading mensaje="Cargando servicios..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
           <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Gestión de Servicios</h2>
           <p className="text-gray-500 text-sm">Administra mantenimientos y reparaciones</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
        >
          <FaPlus /> Nuevo Servicio
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, tipo o equipo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base transition-all"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="w-full pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer text-sm md:text-base transition-all"
            >
              <option value="todos">Todos los Estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="asignado">Asignado</option>
              <option value="en-proceso">En Proceso</option>
              <option value="completado">Completado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* GRID DE SERVICIOS (Usando tu ServicioCard) */}
      {filteredServicios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredServicios.map((servicio) => (
            <ServicioCard 
              key={servicio.id} 
              servicio={{
                ...servicio,
                cliente: servicio.clientes?.nombre || 'Sin cliente',
                sede: servicio.sedes?.nombre || 'Sin sede',
                tecnico: servicio.tecnicos?.nombre || 'Sin asignar',
                fecha: new Date(servicio.fecha).toLocaleDateString('es-ES') 
              }}
              onEdit={() => handleEdit(servicio)} 
              onDelete={() => handleDelete(servicio.id)} 
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md text-center py-12 mt-6 border-2 border-dashed border-gray-200">
          <p className="text-gray-500 text-base md:text-lg">No se encontraron servicios</p>
          <p className="text-gray-400 text-sm">Prueba ajustando los filtros</p>
        </div>
      )}

      {/* MODAL (Tu lógica original intacta) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="bg-blue-600 p-4 md:p-6 text-white flex justify-between items-center sticky top-0 z-10 shrink-0">
              <h3 className="text-xl md:text-2xl font-bold">
                {editingServicio ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h3>
              <button onClick={handleCloseModal} className="text-white/70 hover:text-white cursor-pointer transition">
                <FaTimes size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 overflow-y-auto">
              {/* Selección Cliente/Sede */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo de Servicio *</label>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cliente *</label>
                  <select
                    required
                    value={formData.cliente_id}
                    onChange={(e) => setFormData({...formData, cliente_id: e.target.value, sede_id: ''})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sede *</label>
                  <select
                    required
                    value={formData.sede_id}
                    onChange={(e) => setFormData({...formData, sede_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={!formData.cliente_id}
                  >
                    <option value="">Seleccione una sede</option>
                    {sedesFiltradas.map(sede => (
                      <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Técnico</label>
                  <select
                    value={formData.tecnico_id}
                    onChange={(e) => setFormData({...formData, tecnico_id: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sin asignar</option>
                    {tecnicos.map(tecnico => (
                      <option key={tecnico.id} value={tecnico.id}>{tecnico.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Datos del Equipo */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 border-gray-100">
                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Equipo</label>
                  <input
                    type="text"
                    value={formData.equipo}
                    onChange={(e) => setFormData({...formData, equipo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Split 12000 BTU"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
                  <input
                    type="text"
                    value={formData.marca}
                    onChange={(e) => setFormData({...formData, marca: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="LG"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Modelo</label>
                  <input
                    type="text"
                    value={formData.modelo}
                    onChange={(e) => setFormData({...formData, modelo: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Inverter V"
                  />
                </div>
              </div>

              {/* Fecha y Estado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Hora *</label>
                  <input
                    type="time"
                    required
                    value={formData.hora}
                    onChange={(e) => setFormData({...formData, hora: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({...formData, estado: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="asignado">Asignado</option>
                    <option value="en-proceso">En Proceso</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                    <option value="pendiente">Pendiente (Mover a solicitudes)</option>
                  </select>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows="3"
                  placeholder="Detalles del servicio..."
                />
              </div>

              {/* Botones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium cursor-pointer shadow-lg shadow-blue-200"
                >
                  <FaSave className="inline mr-2" />
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