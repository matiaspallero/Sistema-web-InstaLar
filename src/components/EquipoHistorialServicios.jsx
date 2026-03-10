import { FaHistory, FaDownload, FaCamera } from 'react-icons/fa';

const EquipoHistorialServicios = ({ servicios = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (servicios.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FaHistory size={48} className="mx-auto opacity-20 mb-3" />
        <p className="text-lg font-semibold">No hay servicios registrados</p>
        <p className="text-sm mt-1">Los servicios aparecerán aquí cuando se solicite mantenimiento</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {servicios.map((servicio) => (
        <div 
          key={servicio.id}
          className="border-l-4 border-blue-500 p-4 bg-linear-to-r from-blue-50 to-white rounded-lg hover:shadow-md transition"
        >
          {/* Encabezado */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-bold text-gray-800 text-lg">{servicio.tipo}</p>
              <p className="text-sm text-gray-600">{servicio.descripcion}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
              servicio.estado === 'completado' 
                ? 'bg-green-100 text-green-700'
                : servicio.estado === 'en-proceso'
                ? 'bg-blue-100 text-blue-700'
                : servicio.estado === 'pendiente'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {servicio.estado}
            </span>
          </div>

          {/* Info Meta */}
          <div className="grid md:grid-cols-4 gap-2 text-sm text-gray-600 mb-3 pb-3 border-b border-gray-200">
            <div>
              📅 {new Date(servicio.created_at || servicio.fecha).toLocaleDateString('es-ES')}
            </div>
            <div>
              ⏰ {servicio.hora || 'Sin especificar'}
            </div>
            <div>
              👨‍🔧 {servicio.tecnicos?.nombre || 'Sin asignar'}
            </div>
            <div className="font-semibold">
              Prioridad: <span className={`${
                servicio.prioridad === 'alta' ? 'text-red-600' :
                servicio.prioridad === 'media' ? 'text-yellow-600' :
                'text-green-600'
              }`}>
                {servicio.prioridad || 'Media'}
              </span>
            </div>
          </div>

          {/* Observaciones Técnicas */}
          {servicio.observaciones && (
            <div className="mb-3 bg-white p-3 rounded border-l-2 border-orange-300">
              <p className="text-xs font-bold text-gray-600 mb-1">📋 Informe Técnico:</p>
              <p className="text-sm text-gray-700">{servicio.observaciones}</p>
            </div>
          )}

          {/* Evidencia */}
          {servicio.evidencia_url && (
            <div className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
              <FaCamera /> 
              <a 
                href={servicio.evidencia_url} 
                target="_blank" 
                rel="noreferrer"
                className="hover:underline cursor-pointer"
              >
                Ver foto de evidencia
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EquipoHistorialServicios;