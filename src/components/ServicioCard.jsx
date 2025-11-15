import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTools, FaEdit, FaTrash } from 'react-icons/fa';

function ServicioCard({ servicio, onEdit, onDelete }) {
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="bg-linear-to-r from-blue-500 to-blue-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{servicio.tipo}</h3>
            <p className="text-sm opacity-90 mt-1">{servicio.equipo}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(servicio.estado)}`}>
            {getEstadoTexto(servicio.estado)}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3 text-gray-700">
          <FaMapMarkerAlt className="text-blue-500 text-lg" />
          <div>
            <p className="font-semibold text-gray-800">{servicio.cliente}</p>
            <p className="text-sm text-gray-500">{servicio.sede}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <FaTools className="text-green-500 text-lg" />
          <p className="text-gray-800">{servicio.tecnico}</p>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <FaCalendarAlt className="text-purple-500 text-lg" />
          <p className="text-gray-800">{servicio.fecha}</p>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <FaClock className="text-orange-500 text-lg" />
          <p className="text-gray-800">{servicio.hora}</p>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">{servicio.descripcion}</p>
        </div>

        <div className="flex gap-2 pt-3">
          <button 
            onClick={onEdit}
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <FaEdit /> Editar
          </button>
          <button 
            onClick={onDelete}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <FaTrash /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ServicioCard;