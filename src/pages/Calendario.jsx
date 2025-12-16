import { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarDay, FaFilter, FaTimes } from 'react-icons/fa';
import { api } from '../services/api';

function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterTecnico, setFilterTecnico] = useState('todos');
  const [tecnicos, setTecnicos] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [serviciosData, tecnicosData] = await Promise.all([
        api.servicios.getAll(),
        api.tecnicos.getAll()
      ]);
      setServicios(Array.isArray(serviciosData) ? serviciosData : (serviciosData.servicios || serviciosData.data || []));
      setTecnicos(Array.isArray(tecnicosData) ? tecnicosData : (tecnicosData.tecnicos || tecnicosData.data || []));
    } catch (error) {
      console.error('Error al cargar datos:', error);
      // Establecer arrays vacíos en caso de error
      setServicios([]);
      setTecnicos([]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getServiciosForDate = (day) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0];
    
    if (!Array.isArray(servicios)) {
      return [];
    }
    
    let serviciosFiltrados = servicios.filter(servicio => servicio.fecha === dateStr);

    if (filterEstado !== 'todos') {
      serviciosFiltrados = serviciosFiltrados.filter(s => s.estado === filterEstado);
    }
    if (filterTecnico !== 'todos') {
      serviciosFiltrados = serviciosFiltrados.filter(s => s.tecnico_id === filterTecnico);
    }

    return serviciosFiltrados;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    setShowModal(true);
  };

  const getEstadoBadgeClass = (estado) => {
    const badges = {
      'completado': 'bg-green-100 text-green-800 border-l-4 border-green-500',
      'en-proceso': 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500',
      'pendiente': 'bg-purple-100 text-purple-800 border-l-4 border-purple-500',
      'cancelado': 'bg-red-100 text-red-800 border-l-4 border-red-500'
    };
    return badges[estado] || 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
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

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  const serviciosDelDia = selectedDate ? getServiciosForDate(selectedDate.getDate()) : [];

  const serviciosDelMes = Array.isArray(servicios) 
    ? servicios.filter(servicio => {
        const servicioDate = new Date(servicio.fecha);
        return servicioDate.getMonth() === currentDate.getMonth() && 
              servicioDate.getFullYear() === currentDate.getFullYear();
      })
    : [];

  const statsDelMes = {
    total: serviciosDelMes.length,
    completados: serviciosDelMes.filter(s => s.estado === 'completado').length,
    pendientes: serviciosDelMes.filter(s => s.estado === 'pendiente').length,
    enProceso: serviciosDelMes.filter(s => s.estado === 'en-proceso').length,
    cancelados: serviciosDelMes.filter(s => s.estado === 'cancelado').length
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
      {/* Estadísticas del mes - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-700 rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 text-white">
          <p className="text-xs md:text-sm opacity-90 mb-1">Total del Mes</p>
          <h3 className="text-2xl md:text-3xl font-bold">{statsDelMes.total}</h3>
        </div>
        <div className="bg-linear-to-br from-green-500 to-green-700 rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 text-white">
          <p className="text-xs md:text-sm opacity-90 mb-1">Completados</p>
          <h3 className="text-2xl md:text-3xl font-bold">{statsDelMes.completados}</h3>
        </div>
        <div className="bg-linear-to-br from-yellow-500 to-orange-500 rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 text-white">
          <p className="text-xs md:text-sm opacity-90 mb-1">En Proceso</p>
          <h3 className="text-2xl md:text-3xl font-bold">{statsDelMes.enProceso}</h3>
        </div>
        <div className="bg-linear-to-br from-purple-500 to-purple-700 rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 text-white">
          <p className="text-xs md:text-sm opacity-90 mb-1">Pendientes</p>
          <h3 className="text-2xl md:text-3xl font-bold">{statsDelMes.pendientes}</h3>
        </div>
        <div className="bg-linear-to-br from-red-500 to-red-700 rounded-lg md:rounded-xl shadow-lg p-3 md:p-4 text-white">
          <p className="text-xs md:text-sm opacity-90 mb-1">Cancelados</p>
          <h3 className="text-2xl md:text-3xl font-bold">{statsDelMes.cancelados}</h3>
        </div>
      </div>

      {/* Controles y Filtros - Responsive */}
      <div className="bg-white rounded-xl shadow-md p-3 md:p-4 mb-4 md:mb-6">
        {/* Navegación del calendario */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 mb-4">
          <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto justify-center">
            <button
              onClick={handlePrevMonth}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 md:p-3 rounded-lg transition-colors"
            >
              <FaChevronLeft className="text-sm md:text-base" />
            </button>
            <h2 className="text-lg md:text-2xl font-bold text-gray-800 capitalize min-w-[180px] md:min-w-[250px] text-center">
              {monthName}
            </h2>
            <button
              onClick={handleNextMonth}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 md:p-3 rounded-lg transition-colors"
            >
              <FaChevronRight className="text-sm md:text-base" />
            </button>
          </div>
          <button
            onClick={handleToday}
            className="bg-gray-600 hover:bg-gray-700 text-white px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm md:text-base w-full sm:w-auto justify-center"
          >
            <FaCalendarDay /> Hoy
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
          <FaFilter className="hidden sm:block text-gray-600" />
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          >
            <option value="todos">Todos los Estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="en-proceso">En Proceso</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>

          <select
            value={filterTecnico}
            onChange={(e) => setFilterTecnico(e.target.value)}
            className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          >
            <option value="todos">Todos los Técnicos</option>
            {tecnicos.map(tecnico => (
              <option key={tecnico.id} value={tecnico.id}>
                {tecnico.nombre}
              </option>
            ))}
          </select>

          {(filterEstado !== 'todos' || filterTecnico !== 'todos') && (
            <button
              onClick={() => {
                setFilterEstado('todos');
                setFilterTecnico('todos');
              }}
              className="text-red-600 hover:text-red-700 font-medium flex items-center justify-center gap-1 px-3 py-2 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm md:text-base"
            >
              <FaTimes /> Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day, index) => (
            <div key={day} className="bg-gray-50 p-2 md:p-4 text-center font-semibold text-gray-700">
              <span className="hidden sm:inline">{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][index]}</span>
              <span className="sm:hidden">{day}</span>
            </div>
          ))}

          {[...Array(startingDayOfWeek)].map((_, index) => (
            <div key={`empty-${index}`} className="bg-gray-50 p-2 md:p-4 min-h-[60px] md:min-h-[120px]" />
          ))}

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
                className={`bg-white p-1 md:p-4 min-h-[60px] md:min-h-[120px] cursor-pointer hover:bg-blue-50 transition-colors ${
                  isToday ? 'bg-blue-50 ring-1 md:ring-2 ring-blue-600' : ''
                }`}
              >
                <div className="flex justify-between items-center mb-1 md:mb-2">
                  <span className={`text-xs md:text-sm font-semibold ${
                    isToday ? 'bg-blue-600 text-white px-1 md:px-2 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs' : 'text-gray-700'
                  }`}>
                    {day}
                  </span>
                  {serviciosDay.length > 0 && (
                    <span className="text-[10px] md:text-xs bg-blue-600 text-white px-1 md:px-2 py-0.5 md:py-1 rounded-full font-bold">
                      {serviciosDay.length}
                    </span>
                  )}
                </div>
                <div className="space-y-0.5 md:space-y-1">
                  {serviciosDay.slice(0, window.innerWidth < 768 ? 1 : 2).map((servicio, idx) => (
                    <div
                      key={idx}
                      className={`text-[9px] md:text-xs p-0.5 md:p-1 rounded truncate ${
                        servicio.estado === 'completado' ? 'bg-green-100 text-green-800' :
                        servicio.estado === 'en-proceso' ? 'bg-yellow-100 text-yellow-800' :
                        servicio.estado === 'pendiente' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }`}
                      title={servicio.tipo}
                    >
                      <span className="hidden md:inline">{servicio.tipo}</span>
                      <span className="md:hidden">•</span>
                    </div>
                  ))}
                  {serviciosDay.length > (window.innerWidth < 768 ? 1 : 2) && (
                    <div className="text-[9px] md:text-xs text-gray-500 font-semibold">
                      +{serviciosDay.length - (window.innerWidth < 768 ? 1 : 2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leyenda - Responsive */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mt-4 md:mt-6">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Leyenda de Estados:</h4>
        <div className="grid grid-cols-2 md:flex md:flex-wrap gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-green-500 rounded"></div>
            <span className="text-xs md:text-sm text-gray-700">Completado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-500 rounded"></div>
            <span className="text-xs md:text-sm text-gray-700">En Proceso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-purple-500 rounded"></div>
            <span className="text-xs md:text-sm text-gray-700">Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-500 rounded"></div>
            <span className="text-xs md:text-sm text-gray-700">Cancelado</span>
          </div>
        </div>
      </div>

      {/* Modal - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
            <div className="bg-linear-to-r from-blue-600 to-blue-700 p-4 md:p-6 text-white sticky top-0 z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg md:text-2xl font-bold">
                  <FaCalendarDay className="inline mr-2" />
                  <span className="hidden sm:inline">
                    {selectedDate?.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </span>
                  <span className="sm:hidden">
                    {selectedDate?.toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'short'
                    })}
                  </span>
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 text-2xl md:text-3xl font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs md:text-sm opacity-90 mt-2">
                Total de servicios: <span className="font-bold">{serviciosDelDia.length}</span>
              </p>
            </div>

            <div className="p-3 md:p-6">
              {serviciosDelDia.length === 0 ? (
                <div className="text-center py-8 md:py-12">
                  <FaCalendarDay className="text-4xl md:text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm md:text-lg">No hay servicios programados para este día</p>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {serviciosDelDia.map((servicio) => (
                    <div 
                      key={servicio.id} 
                      className={`rounded-lg p-3 md:p-5 shadow-md hover:shadow-lg transition-shadow ${getEstadoBadgeClass(servicio.estado)}`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 md:gap-3 mb-3">
                        <div>
                          <h4 className="font-bold text-gray-900 text-base md:text-xl mb-1">{servicio.tipo}</h4>
                          <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-semibold ${
                            servicio.estado === 'completado' ? 'bg-green-600 text-white' :
                            servicio.estado === 'en-proceso' ? 'bg-yellow-500 text-white' :
                            servicio.estado === 'pendiente' ? 'bg-purple-600 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {getEstadoTexto(servicio.estado)}
                          </span>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xl md:text-2xl font-bold text-gray-900">{servicio.hora}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-xs md:text-sm mt-3 md:mt-4">
                        <div className="bg-white bg-opacity-60 p-2 md:p-3 rounded">
                          <p className="text-gray-600 font-semibold mb-1">Cliente:</p>
                          <p className="text-gray-900 font-bold truncate">{servicio.clientes?.nombre || 'Sin cliente'}</p>
                        </div>
                        <div className="bg-white bg-opacity-60 p-2 md:p-3 rounded">
                          <p className="text-gray-600 font-semibold mb-1">Sede:</p>
                          <p className="text-gray-900 font-bold truncate">{servicio.sedes?.nombre || 'Sin sede'}</p>
                        </div>
                        <div className="bg-white bg-opacity-60 p-2 md:p-3 rounded">
                          <p className="text-gray-600 font-semibold mb-1">Técnico:</p>
                          <p className="text-gray-900 font-bold truncate">{servicio.tecnicos?.nombre || 'Sin asignar'}</p>
                        </div>
                        <div className="bg-white bg-opacity-60 p-2 md:p-3 rounded">
                          <p className="text-gray-600 font-semibold mb-1">Equipo:</p>
                          <p className="text-gray-900 font-bold truncate">{servicio.equipo || 'No especificado'}</p>
                        </div>
                      </div>

                      {servicio.descripcion && (
                        <div className="mt-3 md:mt-4 bg-white bg-opacity-60 p-2 md:p-3 rounded">
                          <p className="text-gray-600 font-semibold mb-1 text-xs md:text-sm">Descripción:</p>
                          <p className="text-gray-900 text-xs md:text-sm">{servicio.descripcion}</p>
                        </div>
                      )}
                      <div className="mt-4 flex justify-end gap-4">
                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded cursor-pointer">
                          Realizado
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded cursor-pointer">
                          Denegado
                        </button>
                        <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded cursor-pointer">
                          Posponer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendario;