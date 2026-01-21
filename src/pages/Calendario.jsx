import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaChevronLeft, 
  FaChevronRight, 
  FaFilter, 
  FaTimes, 
  FaCalendarDay,
  FaCheckCircle,
  FaClock,
  FaTools,
  FaExclamationCircle
} from 'react-icons/fa';
import { api } from '../services/api';
import Loading from '../components/Loading';
import { useApp } from '../context/AppContext';

function Calendario() {
  const { mostrarNotificacion } = useApp();
  
  // --- ESTADOS ---
  const [servicios, setServicios] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado del Calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null); // Fecha clickeada
  const [showModal, setShowModal] = useState(false);
  
  // Filtros
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterTecnico, setFilterTecnico] = useState('todos');

  // --- CARGAR DATOS ---
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [resServicios, resTecnicos] = await Promise.all([
        api.servicios.getAll(),
        api.tecnicos.getAll()
      ]);

      const dataServicios = Array.isArray(resServicios) ? resServicios : (resServicios.data || []);
      const dataTecnicos = Array.isArray(resTecnicos) ? resTecnicos : (resTecnicos.data || []);

      setServicios(dataServicios);
      setTecnicos(dataTecnicos);
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error cargando la agenda', 'error');
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE CALENDARIO ---
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowModal(true);
  };

  // --- FILTROS Y DATOS COMPUTADOS ---
  
  // 1. Filtrar servicios globales por los selectores
  const serviciosFiltrados = servicios.filter(s => {
    const matchEstado = filterEstado === 'todos' || s.estado === filterEstado;
    const matchTecnico = filterTecnico === 'todos' || s.tecnico_id === filterTecnico;
    return matchEstado && matchTecnico;
  });

  // 2. Obtener servicios para un día específico (para pintar en el calendario)
  const getServiciosForDate = (day) => {
    return serviciosFiltrados.filter(s => {
      if (!s.fecha) return false;
      // Ajuste de zona horaria simple (asumiendo string YYYY-MM-DD)
      const sDate = new Date(s.fecha + 'T00:00:00'); 
      return (
        sDate.getDate() === day &&
        sDate.getMonth() === currentDate.getMonth() &&
        sDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  // 3. Estadísticas del Mes Actual
  const statsDelMes = {
    total: 0,
    completados: 0,
    enProceso: 0,
    pendientes: 0,
    cancelados: 0
  };

  // Recorremos TODOS los servicios (sin filtros de visualización) para estadísticas reales del mes
  servicios.forEach(s => {
    if (!s.fecha) return;
    const sDate = new Date(s.fecha + 'T00:00:00');
    if (sDate.getMonth() === currentDate.getMonth() && sDate.getFullYear() === currentDate.getFullYear()) {
      statsDelMes.total++;
      if (s.estado === 'completado') statsDelMes.completados++;
      else if (s.estado === 'en-proceso') statsDelMes.enProceso++;
      else if (s.estado === 'pendiente') statsDelMes.pendientes++;
      else if (s.estado === 'cancelado') statsDelMes.cancelados++;
    }
  });

  // --- HELPERS VISUALES ---
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const startingDayOfWeek = getFirstDayOfMonth(currentDate);

  const getEstadoBadgeClass = (estado) => {
    const classes = {
      'completado': 'border-l-4 border-green-500 bg-green-50',
      'en-proceso': 'border-l-4 border-yellow-500 bg-yellow-50',
      'pendiente': 'border-l-4 border-purple-500 bg-purple-50',
      'cancelado': 'border-l-4 border-red-500 bg-red-50'
    };
    return classes[estado] || 'bg-gray-50';
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

  const serviciosDelDia = selectedDate 
    ? getServiciosForDate(selectedDate.getDate()) 
    : [];

  if (loading) return <Loading mensaje="Cargando agenda..." />;

  // --- RENDERIZADO ---
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Header con Estadísticas del Mes */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-50 rounded-full text-blue-600">
            <FaCalendarAlt className="text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{monthName}</h2>
            <p className="text-gray-500 text-sm">Vista general de la agenda mensual</p>
          </div>
        </div>

        {/* Grid de Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-blue-600 text-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-24">
            <div className="flex justify-between items-start">
              <span className="text-blue-100 text-xs font-semibold uppercase">Total Mes</span>
              <FaCalendarDay className="opacity-30" />
            </div>
            <span className="text-3xl font-bold">{statsDelMes.total}</span>
          </div>
          
          <div className="bg-green-500 text-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-24">
            <div className="flex justify-between items-start">
              <span className="text-green-100 text-xs font-semibold uppercase">Completados</span>
              <FaCheckCircle className="opacity-30" />
            </div>
            <span className="text-3xl font-bold">{statsDelMes.completados}</span>
          </div>

          <div className="bg-yellow-500 text-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-24">
            <div className="flex justify-between items-start">
              <span className="text-yellow-100 text-xs font-semibold uppercase">En Proceso</span>
              <FaTools className="opacity-30" />
            </div>
            <span className="text-3xl font-bold">{statsDelMes.enProceso}</span>
          </div>

          <div className="bg-purple-500 text-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-24">
            <div className="flex justify-between items-start">
              <span className="text-purple-100 text-xs font-semibold uppercase">Pendientes</span>
              <FaClock className="opacity-30" />
            </div>
            <span className="text-3xl font-bold">{statsDelMes.pendientes}</span>
          </div>

          <div className="bg-red-500 text-white p-4 rounded-xl shadow-sm flex flex-col justify-between h-24 col-span-2 lg:col-span-1">
            <div className="flex justify-between items-start">
              <span className="text-red-100 text-xs font-semibold uppercase">Cancelados</span>
              <FaExclamationCircle className="opacity-30" />
            </div>
            <span className="text-3xl font-bold">{statsDelMes.cancelados}</span>
          </div>
        </div>
      </div>

      {/* 2. Controles y Calendario */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Barra de Herramientas */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Navegación */}
          <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-lg">
            <button onClick={handlePrevMonth} className="p-2 cursor-pointer hover:bg-white rounded-md text-gray-600 transition shadow-sm">
              <FaChevronLeft />
            </button>
            <button onClick={handleToday} className="px-4 py-1 cursor-pointer text-sm font-bold text-gray-700 hover:text-blue-600 transition">
              Hoy
            </button>
            <button onClick={handleNextMonth} className="p-2 cursor-pointer hover:bg-white rounded-md text-gray-600 transition shadow-sm">
              <FaChevronRight />
            </button>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative">
              <FaFilter className="absolute left-3 top-3 text-gray-400 text-xs" />
              <select
                value={filterEstado}
                onChange={(e) => setFilterEstado(e.target.value)}
                className="pl-8 pr-4 cursor-pointer py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full bg-gray-50"
              >
                <option value="todos">Todos los Estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en-proceso">En Proceso</option>
                <option value="completado">Completado</option>
              </select>
            </div>

            <div className="relative">
              <FaTools className="absolute left-3 top-3 text-gray-400 text-xs" />
              <select
                value={filterTecnico}
                onChange={(e) => setFilterTecnico(e.target.value)}
                className="pl-8 cursor-pointer pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full bg-gray-50"
              >
                <option value="todos">Todos los Técnicos</option>
                {tecnicos.map(t => (
                  <option key={t.id} value={t.id}>{t.nombre}</option>
                ))}
              </select>
            </div>

            {(filterEstado !== 'todos' || filterTecnico !== 'todos') && (
              <button 
                onClick={() => { setFilterEstado('todos'); setFilterTecnico('todos'); }}
                className="px-4 py-2 cursor-pointer text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium transition"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Grilla del Calendario */}
        <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-fr bg-gray-200 gap-px border-b border-gray-200">
          {/* Celdas vacías del inicio del mes */}
          {[...Array(startingDayOfWeek)].map((_, index) => (
            <div key={`empty-${index}`} className="bg-gray-50/50 min-h-[120px]" />
          ))}

          {/* Días del mes */}
          {[...Array(daysInMonth)].map((_, index) => {
            const day = index + 1;
            const serviciosDay = getServiciosForDate(day);
            const isToday = new Date().getDate() === day && 
                            new Date().getMonth() === currentDate.getMonth() &&
                            new Date().getFullYear() === currentDate.getFullYear();

            return (
              <div
                key={day}
                onClick={() => handleDateClick(day)}
                className={`bg-white p-2 min-h-[120px] cursor-pointer hover:bg-blue-50 transition-colors relative group
                  ${isToday ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold
                    ${isToday ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {serviciosDay.length > 0 && (
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium border border-gray-200">
                      {serviciosDay.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  {serviciosDay.slice(0, 3).map((servicio, idx) => (
                    <div 
                      key={idx}
                      className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium border-l-2
                        ${servicio.estado === 'completado' ? 'bg-green-50 text-green-700 border-green-500' :
                          servicio.estado === 'en-proceso' ? 'bg-yellow-50 text-yellow-700 border-yellow-500' :
                          servicio.estado === 'pendiente' ? 'bg-purple-50 text-purple-700 border-purple-500' :
                          'bg-red-50 text-red-700 border-red-500'}`}
                    >
                      {servicio.tipo}
                    </div>
                  ))}
                  {serviciosDay.length > 3 && (
                    <div className="text-[10px] text-center text-gray-400 font-medium">
                      +{serviciosDay.length - 3} más...
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Modal de Detalles del Día */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <FaCalendarDay />
                  {selectedDate?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <p className="text-blue-100 text-sm mt-1">
                  {serviciosDelDia.length} servicios programados
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="bg-white/10 hover:bg-white/20 cursor-pointer p-2 rounded-full transition text-white"
              >
                <FaTimes size={18}/>
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-gray-50">
              {serviciosDelDia.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 text-2xl">
                    <FaCalendarAlt />
                  </div>
                  <p className="text-gray-500 font-medium">No hay servicios para este día</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {serviciosDelDia.map((servicio) => (
                    <div 
                      key={servicio.id} 
                      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow ${getEstadoBadgeClass(servicio.estado)}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800 text-lg">{servicio.tipo}</h4>
                        <span className="text-lg font-bold text-gray-600">{servicio.hora}</span>
                      </div>
                      
                      <div className="space-y-1 text-sm text-gray-600 mb-3">
                        <p><strong className="text-gray-800">Cliente:</strong> {servicio.clientes?.nombre || 'N/A'}</p>
                        <p><strong className="text-gray-800">Técnico:</strong> {servicio.tecnicos?.nombre || 'Sin asignar'}</p>
                        {servicio.descripcion && (
                          <p className="italic bg-gray-50 p-2 rounded mt-2 text-xs border border-gray-100">
                            "{servicio.descripcion}"
                          </p>
                        )}
                      </div>

                      <div className="flex justify-end pt-2 border-t border-gray-100">
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide
                          ${servicio.estado === 'completado' ? 'text-green-600 bg-green-100' :
                            servicio.estado === 'en-proceso' ? 'text-yellow-600 bg-yellow-100' :
                            'text-purple-600 bg-purple-100'}`}>
                          {getEstadoTexto(servicio.estado)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 flex justify-end gap-3">
              <button className="bg-green-600 text-white px-4 py-2 rounded mr-2 cursor-pointer hover:bg-green-700" onClick={() => alert('Aceptar')}>Aceptar</button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded mr-2 cursor-pointer hover:bg-yellow-600" onClick={() => alert('En Proceso')}>En Proceso </button>
              <button className="bg-purple-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-purple-600" onClick={() => alert('Pendiente')}>Pendiente</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendario;