// MODAL PARA SOLICITAR UN SERVICIO DESDE EL DASHBOARD DE CLIENTE, CON CREACIÓN DE EQUIPO INCLUIDA
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

  const ahora = new Date();
  const fechaHoy = ahora.toISOString().split('T')[0];
  const horaAhora = ahora.toLocaleTimeString('es-AR', { hour12: false }).slice(0, 5);
  
  const [formData, setFormData] = useState({
    // Ubicación
    sede_id: '',
    // Tipo de Servicio
    tipo: 'Mantenimiento',
    fecha: fechaHoy,
    hora: horaAhora,
    prioridad: 'media',
    descripcion: '',
    
    // DATOS DEL EQUIPO (NUEVOS)
    equipo_tipo: 'split',
    equipo_marca: '',
    equipo_modelo: '',
    equipo_serie: '',
    equipo_frigorias: '9000',
    equipo_observaciones: ''
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      
      // Validar que tenga sede seleccionada
      if (!formData.sede_id) {
        mostrarNotificacion('❌ Selecciona una sede', 'warning');
        setLoading(false);
        return;
      }

      // Validar datos del equipo
      if (!formData.equipo_marca || !formData.equipo_modelo || !formData.equipo_serie) {
        mostrarNotificacion('❌ Completa todos los datos obligatorios del equipo', 'warning');
        setLoading(false);
        return;
      }
      // 1️⃣ CREAR EL EQUIPO PRIMERO
      const equipoData = {
        cliente_id: user.id,
        sede_id: formData.sede_id,
        tipo: formData.equipo_tipo,
        marca: formData.equipo_marca.trim(),
        modelo: formData.equipo_modelo.trim(),
        serie: formData.equipo_serie.trim(),
        frigorias: parseInt(formData.equipo_frigorias),
        voltaje: '220',
        fecha_instalacion: new Date().toISOString().split('T')[0],
        observaciones: formData.equipo_observaciones?.trim() || '',
        estado: 'activo'
      };

      console.log('Datos del equipo a crear:', equipoData);

      const resEquipo = await api.equipos.create(equipoData);
      console.log('✅ Respuesta equipo:', resEquipo);

      if (!resEquipo || !resEquipo.id) {
        throw new Error('No se pudo crear el equipo. Respuesta inesperada del servidor.');
      }


      const equipoId = resEquipo.id || resEquipo.data?.id;
      console.log('✅ Equipo ID:', equipoId);

      // 2️⃣ CREAR EL SERVICIO VINCULADO AL EQUIPO
      const servicioData = {
        cliente_id: user.id,
        sede_id: formData.sede_id,
        equipo_id: equipoId,
        tipo: formData.tipo,
        fecha: formData.fecha,
        hora: formData.hora,
        prioridad: formData.prioridad || 'media',  // ✅ AGREGAR AQUÍ
        descripcion: formData.descripcion?.trim() || '',
        estado: 'pendiente'
      };

      console.log('📋 Enviando servicio:', servicioData);

      const resServicio = await api.servicios.solicitar(servicioData);
      console.log('✅ Respuesta servicio:', resServicio);

      mostrarNotificacion('✅ Solicitud enviada. Equipo registrado en el sistema.', 'success');
      onSuccess?.();
      onClose();

    } catch (error) {
      console.error('❌ ERROR COMPLETO', error)
      mostrarNotificacion(error.message || 'Error al enviar solicitud', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg flex items-center gap-2"><FaTools /> Nueva Solicitud de Servicio</h2>
          <button onClick={onClose} className="text-white/80 hover:text-white cursor-pointer"><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* ========== SECCIÓN 1: UBICACIÓN Y TIPO ========== */}
          <div className="border-b pb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
              <FaBuilding /> Ubicación y Servicio
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Sede / Ubicación *</label>
                <select 
                  name="sede_id" required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  value={formData.sede_id} onChange={handleChange}
                >
                  <option value="">Seleccione una sede...</option>
                  {sedes.map(sede => (
                    <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Servicio *</label>
                <select 
                  name="tipo" required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  value={formData.tipo} onChange={handleChange}
                >
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Reparación">Reparación</option>
                  <option value="Instalación">Instalación</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Prioridad *</label>
                <select 
                  name="prioridad" required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  value={formData.prioridad} onChange={handleChange}
                >
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Fecha Preferida *</label>
                <input 
                  type="date" name="fecha" required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  value={formData.fecha} onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Hora Aproximada *</label>
                <input 
                  type="time" name="hora" required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                  value={formData.hora} onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Descripción del Problema *</label>
              <textarea 
                name="descripcion" required rows="3"
                placeholder="Describa el problema o solicitud con detalle..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                value={formData.descripcion} onChange={handleChange}
              />
            </div>
          </div>

          {/* ========== SECCIÓN 2: DATOS DEL EQUIPO ========== */}
          <div className="border-b pb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
              <FaLaptop /> Datos del Equipo (se guardará en el sistema)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Equipo *</label>
                <select 
                  name="equipo_tipo" required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  value={formData.equipo_tipo} onChange={handleChange}
                >
                  <option value="split">Split</option>
                  <option value="ventana">Ventana</option>
                  <option value="central">Central</option>
                  <option value="portatil">Portátil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Frigorías *</label>
                <select 
                  name="equipo_frigorias" required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                  value={formData.equipo_frigorias} onChange={handleChange}
                >

                  <option value="2250">2.250 F</option>
                  <option value="3000">3.000 F</option>
                  <option value="3500">3.500 F</option>
                  <option value="4500">4.500 F</option>
                  <option value="5000">5.000 F</option>
                  <option value="6000">6.000 F</option>
                  <option value="7500">7.500 F</option>
                  <option value="9000">9.000 F</option>
                  <option value="12000">12.000 F</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Marca *</label>
                <input 
                  type="text" name="equipo_marca" required
                  placeholder="LG, Daikin, Fujitsu..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.equipo_marca} onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Modelo *</label>
                <input 
                  type="text" name="equipo_modelo" required
                  placeholder="LS-H1235STI..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.equipo_modelo} onChange={handleChange}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-1">Número de Serie *</label>
                <input 
                  type="text" name="equipo_serie" required
                  placeholder="ABC123456789..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.equipo_serie} onChange={handleChange}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-1">Observaciones Técnicas</label>
              <textarea 
                name="equipo_observaciones" rows="2"
                placeholder="Posición de instalación, voltaje, datos especiales..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                value={formData.equipo_observaciones} onChange={handleChange}
              />
            </div>
          </div>

          {/* ========== BOTONES ========== */}
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