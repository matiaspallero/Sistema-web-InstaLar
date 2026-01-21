import { FaPhone, FaEnvelope, FaStar, FaTools, FaCheckCircle, FaEdit, FaTrash, FaUserTie } from 'react-icons/fa';

function TecnicoCard({ tecnico, onEdit, onDelete }) {
  const getEstadoBadge = (estado) => {
    const badges = {
      'disponible': 'bg-green-500',
      'ocupado': 'bg-yellow-500',
      'no-disponible': 'bg-red-500'
    };
    return badges[estado] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
      <div className="bg-linear-to-br from-blue-500 to-purple-600 p-6 text-white relative">
        <div className="flex justify-between items-start mb-4">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <FaUserTie className="text-4xl text-blue-500" />
          </div>
          <span className={`w-4 h-4 rounded-full ${getEstadoBadge(tecnico.estado)}`}></span>
        </div>
        <h2 className="text-xl font-bold">{tecnico.nombre} {tecnico.apellido}</h2>
        <p className="text-sm opacity-90 mt-1">{tecnico.especialidad}</p>
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 text-gray-700">
          <FaPhone className="text-blue-500" />
          <p className="text-sm">{tecnico.telefono}</p>
        </div>

        <div className="flex items-center gap-3 text-gray-700">
          <FaEnvelope className="text-purple-500" />
          <p className="text-sm">{tecnico.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-orange-500 mb-1">
              <FaTools />
            </div>
            <p className="text-2xl font-bold text-gray-800">{tecnico.serviciosActivos}</p>
            <p className="text-xs text-gray-500">Activos</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-green-500 mb-1">
              <FaCheckCircle />
            </div>
            <p className="text-2xl font-bold text-gray-800">{tecnico.serviciosCompletados}</p>
            <p className="text-xs text-gray-500">Completados</p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <button 
            onClick={onEdit}
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 cursor-pointer py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaEdit /> Editar
          </button>
          <button 
            onClick={onDelete}
            className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaTrash /> Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default TecnicoCard;