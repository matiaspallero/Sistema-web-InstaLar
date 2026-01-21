import { useState, useEffect } from 'react';
import { FaTimes, FaUserTie, FaMapMarkerAlt, FaCalendarAlt, FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';

const AdminAsignacionModal = ({ solicitud, onClose, onSuccess }) => {
  const { mostrarNotificacion } = useApp();
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTecnico, setSelectedTecnico] = useState('');
  const [assigning, setAssigning] = useState(false);

  // Cargar técnicos al abrir
  useEffect(() => {
    const cargarTecnicos = async () => {
      try {
        const data = await api.tecnicos.getAll();
        // Filtramos solo los disponibles o mostramos todos con indicador
        setTecnicos(Array.isArray(data) ? data : (data.data || []));
      } catch (error) {
        console.error("Error cargando técnicos", error);
      } finally {
        setLoading(false);
      }
    };
    cargarTecnicos();
  }, []);

  const handleAsignar = async () => {
    if (!selectedTecnico) {
      mostrarNotificacion('Debes seleccionar un técnico', 'warning');
      return;
    }

    try {
      setAssigning(true);
      
      // Llamada a la API para asignar (asegúrate que tu backend tenga este endpoint o usa update)
      // Si usas el controlador que me pasaste antes, la ruta era PATCH /solicitudes/:id/asignar-tecnico
      await api.solicitudes.asignarTecnico(solicitud.id, selectedTecnico);
      
      mostrarNotificacion('Técnico asignado correctamente', 'success');
      onSuccess(); // Recargar dashboard
      onClose();
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error al asignar técnico', 'error');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gray-900 p-6 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              Asignar Técnico
            </h2>
            <p className="text-gray-400 text-sm mt-1">Solicitud #{solicitud.id.slice(0, 8)}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white cursor-pointer transition">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Resumen de la Solicitud */}
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2 border-b border-blue-200 pb-2">Detalles del Servicio</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="block text-blue-500 text-xs font-bold uppercase">Cliente</span>
                <span className="text-gray-800 font-medium">{solicitud.clientes?.nombre || 'Cliente Desconocido'}</span>
              </div>
              <div>
                <span className="block text-blue-500 text-xs font-bold uppercase">Sede / Ubicación</span>
                <span className="text-gray-800 font-medium flex items-center gap-1">
                  <FaMapMarkerAlt /> {solicitud.sedes?.nombre || 'Sede Principal'}
                </span>
              </div>
              <div>
                <span className="block text-blue-500 text-xs font-bold uppercase">Tipo</span>
                <span className="bg-white px-2 py-1 rounded border border-blue-100 inline-block mt-1 font-medium capitalize">
                  {solicitud.tipo}
                </span>
              </div>
              <div>
                <span className="block text-blue-500 text-xs font-bold uppercase">Prioridad</span>
                <span className={`inline-flex items-center gap-1 font-bold ${
                  solicitud.prioridad === 'urgente' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {solicitud.prioridad === 'urgente' && <FaExclamationTriangle />} 
                  {solicitud.prioridad || 'Normal'}
                </span>
              </div>
            </div>
            <div className="mt-4">
              <span className="block text-blue-500 text-xs font-bold uppercase">Descripción del Problema</span>
              <p className="text-gray-700 italic bg-white p-3 rounded-lg border border-blue-100 mt-1">
                "{solicitud.descripcion}"
              </p>
            </div>
          </div>

          {/* Selector de Técnicos */}
          <div>
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <FaUserTie className="text-gray-500" /> Seleccionar Técnico Disponible
            </h3>
            
            {loading ? (
              <div className="p-4 text-center text-gray-500">Buscando técnicos...</div>
            ) : (
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto pr-2">
                {tecnicos.map(tecnico => (
                  <div 
                    key={tecnico.id}
                    onClick={() => setSelectedTecnico(tecnico.id)}
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-all flex justify-between items-center group
                      ${selectedTecnico === tecnico.id 
                        ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-500' 
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${
                        tecnico.estado === 'disponible' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}>
                        {tecnico.nombre.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{tecnico.nombre}</p>
                        <p className="text-xs text-gray-500">{tecnico.especialidad}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        tecnico.estado === 'disponible' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {tecnico.estado}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 cursor-pointer border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleAsignar}
            disabled={assigning || !selectedTecnico}
            className="px-6 py-2 cursor-pointer bg-gray-900 text-white rounded-lg hover:bg-black transition font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {assigning ? 'Asignando...' : <><FaCheck /> Confirmar Asignación</>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAsignacionModal;