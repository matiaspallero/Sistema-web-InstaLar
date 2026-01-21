import { useState, useEffect } from 'react';
import { FaTimes, FaSave, FaBuilding, FaCalendarAlt, FaClock, FaTools, FaLaptop } from 'react-icons/fa';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const SolicitarServicioModal = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const { mostrarNotificacion } = useApp();
  
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Inicializamos con la fecha y hora actual por defecto para ayudar al usuario
  const ahora = new Date();
  const fechaHoy = ahora.toISOString().split('T')[0];
  const horaAhora = ahora.toLocaleTimeString('es-AR', { hour12: false }).slice(0, 5);

  const [formData, setFormData] = useState({
    sede_id: '',
    tipo: 'Mantenimiento', // Valor por defecto
    fecha: fechaHoy,
    hora: horaAhora,
    prioridad: 'baja', // Valor por defecto
    equipo: '',
    marca: '',
    modelo: '',
    descripcion: ''
  });

  useEffect(() => {
    const cargarSedes = async () => {
      try {
        const res = await api.sedes.getByUser(user.id);
        const data = Array.isArray(res) ? res : (res.data || []);
        setSedes(data);
      } catch (error) {
        console.error("Error cargando sedes", error);
      }
    };
    if (user?.id) cargarSedes();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Enviamos los datos tal cual los pide la tabla
      await api.servicios.solicitar({
        ...formData,
        usuario_id: user.id
      });
      mostrarNotificacion('Solicitud enviada correctamente', 'success');
      onSuccess();
      onClose();
    } catch (error) {
      mostrarNotificacion(error.message || 'Error al enviar solicitud', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2"><FaTools /> Nueva Solicitud</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white cursor-pointer"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Fila 1: Sede y Tipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Sede / Ubicación *</label>
              <div className="relative">
                <FaBuilding className="absolute left-3 top-3 text-gray-400" />
                <select 
                  name="sede_id" required
                  className="w-full pl-10 pr-3 py-2 cursor-pointer border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={formData.sede_id} onChange={handleChange}
                >
                  <option value="">Seleccione una sede...</option>
                  {sedes.map(sede => (
                    <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Servicio *</label>
              <select 
                name="tipo" required
                className="w-full px-3 py-2 cursor-pointer border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.tipo} onChange={handleChange}
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

          {/* Fila 2: Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Fecha Preferida *</label>
              <div className="relative">
                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="date" name="fecha" required
                  className="w-full pl-10 pr-3 py-2 cursor-pointer border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.fecha} onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Hora Aproximada *</label>
              <div className="relative">
                <FaClock className="absolute left-3 top-3 text-gray-400" />
                <input 
                  type="time" name="hora" required
                  className="w-full pl-10 pr-3 py-2 cursor-pointer border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.hora} onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Fila 3: Datos del Equipo (Opcionales pero útiles) */}
          <div className="border-t border-gray-100 pt-4 mt-2">
            <h3 className="text-sm font-semibold text-gray-500 mb-3 flex items-center gap-2"><FaLaptop /> Datos del Equipo (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input 
                type="text" name="equipo" placeholder="Equipo (Ej: Split 3000)" 
                className="px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData.equipo} onChange={handleChange}
              />
              <input 
                type="text" name="marca" placeholder="Marca" 
                className="px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData.marca} onChange={handleChange}
              />
              <input 
                type="text" name="modelo" placeholder="Modelo" 
                className="px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                value={formData.modelo} onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción del Problema *</label>
            <textarea 
              name="descripcion" required rows="3"
              placeholder="Describa el problema o solicitud con detalle..."
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
              value={formData.descripcion} onChange={handleChange}
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 border rounded-lg hover:bg-gray-100 font-semibold cursor-pointer">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading || sedes.length === 0}
              className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
            >
              <FaSave /> {loading ? 'Enviando...' : 'Confirmar Solicitud'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitarServicioModal;