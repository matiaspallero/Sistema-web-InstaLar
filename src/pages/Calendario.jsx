import { useState } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import CalendarioMantenimiento from '../components/CalendarioMantenimiento';

function Calendario() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [showEventModal, setShowEventModal] = useState(false);

  const [eventos, setEventos] = useState([
    {
      id: 1,
      titulo: 'Mantenimiento Preventivo',
      cliente: 'Empresa ABC',
      sede: 'Sede Central',
      tecnico: 'Juan Pérez',
      fecha: '2024-11-15',
      horaInicio: '10:00',
      horaFin: '12:00',
      tipo: 'mantenimiento',
      estado: 'programado'
    },
    {
      id: 2,
      titulo: 'Reparación Urgente',
      cliente: 'Hotel XYZ',
      sede: 'Recepción',
      tecnico: 'María García',
      fecha: '2024-11-14',
      horaInicio: '14:00',
      horaFin: '16:00',
      tipo: 'reparacion',
      estado: 'en-proceso'
    },
    {
      id: 3,
      titulo: 'Instalación',
      cliente: 'Oficinas Central',
      sede: 'Piso 3',
      tecnico: 'Carlos López',
      fecha: '2024-11-16',
      horaInicio: '09:00',
      horaFin: '13:00',
      tipo: 'instalacion',
      estado: 'programado'
    },
    {
      id: 4,
      titulo: 'Revisión General',
      cliente: 'Empresa ABC',
      sede: 'Sala de Juntas',
      tecnico: 'Ana Martínez',
      fecha: '2024-11-15',
      horaInicio: '15:00',
      horaFin: '17:00',
      tipo: 'revision',
      estado: 'programado'
    }
  ]);

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getTipoColor = (tipo) => {
    const colores = {
      'mantenimiento': 'bg-blue-500',
      'reparacion': 'bg-red-500',
      'instalacion': 'bg-green-500',
      'revision': 'bg-purple-500'
    };
    return colores[tipo] || 'bg-gray-500';
  };

  const eventosHoy = eventos.filter(evento => {
    const today = new Date().toISOString().split('T')[0];
    return evento.fecha === today;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Calendario de Servicios</h2>
        <button 
          onClick={() => setShowEventModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <FaPlus /> Programar Servicio
        </button>
      </div>

      {/* Controles del Calendario */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronLeft className="text-gray-600" />
            </button>
            <h3 className="text-xl font-bold text-gray-800 min-w-[200px] text-center">
              {meses[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronRight className="text-gray-600" />
            </button>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Hoy
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'month' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Día
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario Principal */}
        <div className="lg:col-span-2">
          <CalendarioMantenimiento 
            eventos={eventos} 
            currentDate={currentDate}
            viewMode={viewMode}
          />
        </div>

        {/* Panel Lateral - Eventos de Hoy */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" />
              Servicios de Hoy
            </h3>
            {eventosHoy.length > 0 ? (
              <div className="space-y-3">
                {eventosHoy.map(evento => (
                  <div key={evento.id} className="border-l-4 border-blue-500 pl-4 py-2 hover:bg-gray-50 rounded-r-lg transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{evento.titulo}</p>
                        <p className="text-sm text-gray-600">{evento.cliente} - {evento.sede}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {evento.horaInicio} - {evento.horaFin}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Técnico: {evento.tecnico}</p>
                      </div>
                      <span className={`w-3 h-3 rounded-full ${getTipoColor(evento.tipo)}`}></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No hay servicios programados para hoy</p>
            )}
          </div>

          {/* Leyenda */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Leyenda</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 bg-blue-500 rounded"></span>
                <span className="text-sm text-gray-700">Mantenimiento</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 bg-red-500 rounded"></span>
                <span className="text-sm text-gray-700">Reparación</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 bg-green-500 rounded"></span>
                <span className="text-sm text-gray-700">Instalación</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 bg-purple-500 rounded"></span>
                <span className="text-sm text-gray-700">Revisión</span>
              </div>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Este Mes</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Servicios</span>
                <span className="text-lg font-bold text-gray-800">{eventos.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completados</span>
                <span className="text-lg font-bold text-green-600">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Programados</span>
                <span className="text-lg font-bold text-blue-600">
                  {eventos.filter(e => e.estado === 'programado').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">En Proceso</span>
                <span className="text-lg font-bold text-yellow-600">
                  {eventos.filter(e => e.estado === 'en-proceso').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Calendario;