import { FaBuilding, FaMapMarkerAlt, FaEdit, FaTrash } from 'react-icons/fa';

function SedeCard({ sede, onEdit, onDelete }) {
  const getEstadoBadge = (estado) => {
    const badges = {
      'activo': 'bg-green-100 text-green-800',
      'mantenimiento-pendiente': 'bg-yellow-100 text-yellow-800',
      'inactivo': 'bg-red-100 text-red-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      'activo': 'Activo',
      'mantenimiento-pendiente': 'Mantenimiento Pendiente',
      'inactivo': 'Inactivo'
    };
    return textos[estado] || estado;
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
      <div className="bg-linear-to-r from-indigo-500 to-purple-600 p-6 text-white">
        <div className="flex items-start justify-between mb-3">
          <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm">
            <FaBuilding className="text-3xl" />
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(sede.estado)}`}>
            {getEstadoTexto(sede.estado)}
          </span>
        </div>
        <h3 className="text-xl font-bold">{sede.nombre}</h3>
        <p className="text-sm opacity-90 mt-1">{sede.cliente}</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-start gap-3 text-gray-700">
          <FaMapMarkerAlt className="text-red-500 mt-1 text-lg shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-800">{sede.direccion}</p>
            <p className="text-xs text-gray-500 mt-1">{sede.ciudad}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{sede.equipos}</p>
            <p className="text-xs text-gray-500 mt-1">Equipos</p>
          </div>
          <div className="text-center col-span-2 border-l border-gray-200 pl-2">
            <p className="text-sm font-semibold text-gray-700">Próximo Mantenimiento</p>
            <p className="text-sm text-purple-600 font-medium mt-1">{sede.proximoMantenimiento}</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-1">Último Mantenimiento</p>
          <p className="text-sm text-gray-800 font-semibold">{sede.ultimoMantenimiento}</p>
        </div>

        <div className="flex gap-2 pt-4">
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

export default SedeCard;