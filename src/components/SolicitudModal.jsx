// PARA CLIENTES: Modal para crear una nueva solicitud de servicio
import { useState, useEffect } from 'react';
import { FaTimes, FaMapMarkerAlt, FaTools, FaCalendarAlt, FaExclamationCircle } from 'react-icons/fa';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

const SolicitudModal = ({ onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [sedes, setSedes] = useState([]);
  const [loadingSedes, setLoadingSedes] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    sede_id: '',
    tipo_servicio: 'mantenimiento', // valor por defecto
    descripcion: '',
    fecha_preferida: '',
    prioridad: 'media'
  });

  // 1. Cargar las sedes del cliente al abrir el modal
  useEffect(() => {
    const cargarSedes = async () => {
      try {
        const data = await api.sedes.getAll();
        setSedes(data);
        // Si hay sedes, pre-seleccionar la primera
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, sede_id: data[0].id }));
        }
      } catch (err) {
        console.error("Error cargando sedes", err);
        setError("No se pudieron cargar tus sedes.");
      } finally {
        setLoadingSedes(false);
      }
    };
    cargarSedes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (!formData.sede_id) throw new Error("Debes seleccionar una sede.");
      
      await api.solicitudes.create(formData);
      onSuccess(); // Recargar dashboard
      onClose(); // Cerrar modal
    } catch (err) {
      setError(err.message || "Error al crear la solicitud");
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaTools /> Nueva Solicitud
          </h2>
          <button onClick={onClose} className="text-white/80 cursor-pointer hover:text-white transition-colors">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          
          {loadingSedes ? (
            <div className="text-center py-8 text-gray-500">Cargando tus sedes...</div>
          ) : sedes.length === 0 ? (
            // CASO: Cliente sin sedes
            <div className="text-center py-6">
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4 flex items-center gap-3">
                <FaExclamationCircle className="text-2xl shrink-0" />
                <p className="text-left text-sm">
                  Para solicitar un servicio, primero debes registrar al menos una ubicación (Casa, Oficina, etc).
                </p>
              </div>
              <button 
                onClick={() => navigate('/sedes')}
                className="bg-blue-600 text-white cursor-pointer px-6 py-2 rounded-lg font-bold hover:bg-blue-700 w-full"
              >
                Registrar mi primera Sede
              </button>
            </div>
          ) : (
            // CASO: Formulario Normal
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Selección de Sede */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  ¿Dónde es el problema? (Sede)
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={formData.sede_id}
                    onChange={(e) => setFormData({...formData, sede_id: e.target.value})}
                    className="cursor-pointer w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white"
                  >
                    {sedes.map(sede => (
                      <option key={sede.id} value={sede.id}>{sede.nombre} - {sede.direccion}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tipo de Servicio */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Tipo</label>
                  <select
                    value={formData.tipo_servicio}
                    onChange={(e) => setFormData({...formData, tipo_servicio: e.target.value})}
                    className="w-full px-4 py-2 cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="reparacion">Reparación</option>
                    <option value="instalacion">Instalación</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={formData.prioridad}
                    onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
                    className="w-full px-4 py-2 cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Fecha Preferida */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Fecha Preferida (Opcional)</label>
                <div className="relative">
                  <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="date"
                    value={formData.fecha_preferida}
                    onChange={(e) => setFormData({...formData, fecha_preferida: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 cursor-pointer border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    min={new Date().toISOString().split('T')[0]} // No permitir fechas pasadas
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Descripción del problema
                </label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  placeholder="Ej: El aire de la sala de reuniones gotea agua y hace ruido..."
                  required
                ></textarea>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="cursor-pointer flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? 'Enviando...' : 'Confirmar Solicitud'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SolicitudModal;