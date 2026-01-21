import { useState, useEffect } from 'react';
import { 
  FaInbox, FaCheck, FaTimes, FaUser, FaMapMarkerAlt, FaClock, FaTools 
} from 'react-icons/fa';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import AdminAsignacionModal from '../components/AdminAsignacionModal';

const Solicitudes = () => {
  const { mostrarNotificacion } = useApp();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el modal de asignar técnico (simplificado)
  const [tecnicos, setTecnicos] = useState([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      // 1. Usamos el endpoint ESPECÍFICO de solicitudes (que ya filtra pendientes en el backend)
      const res = await api.solicitudes.getAll();
      const data = Array.isArray(res) ? res : (res.data || []);
      setSolicitudes(data);
      
      // Cargar técnicos para el selector (puedes optimizar esto cargándolo solo al abrir modal)
      const resTecnicos = await api.tecnicos.getAll();
      setTecnicos(Array.isArray(resTecnicos) ? resTecnicos : (resTecnicos.data || []));
      
    } catch (error) {
      console.error(error);
      // mostrarNotificacion('Error al cargar solicitudes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = (solicitud) => {
    // Abrimos selección de técnico
    setSolicitudSeleccionada(solicitud);
  };

  const handleExito = () => {
    mostrarNotificacion('Técnico asignado correctamente', 'success');
    setSolicitudSeleccionada(null); // Cierra el modal
    cargarDatos(); // Recarga la tabla para que desaparezca la solicitud vieja
  };

  const handleRechazar = async (id) => {
    if(window.confirm("¿Rechazar esta solicitud? Se eliminará del sistema.")) {
        try {
            await api.solicitudes.delete(id);
            mostrarNotificacion('Solicitud rechazada', 'info');
            cargarDatos();
        } catch (error) {
            mostrarNotificacion('Error al rechazar', 'error');
        }
    }
  };

  if (loading) return <Loading mensaje="Buscando nuevas solicitudes..." />;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Modal Rápido para Seleccionar Técnico */}
      {solicitudSeleccionada && (
        <AdminAsignacionModal
          solicitud={solicitudSeleccionada}
          tecnicos={tecnicos}
          onClose={() => setSolicitudSeleccionada(null)}
          onSuccess={handleExito}
        />
      )}
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaInbox className="text-purple-600" /> Bandeja de Solicitudes
          </h1>
          <p className="text-gray-500 text-sm">Gestiona los pedidos pendientes de asignación</p>
        </div>
        <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold text-sm">
          {solicitudes.length} Pendientes
        </div>
      </div>

      {/* Lista */}
      {solicitudes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {solicitudes.map((solicitud) => (
            <div key={solicitud.id} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500 flex flex-col md:flex-row justify-between gap-6 hover:shadow-md transition-all">
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded uppercase">
                        PENDIENTE
                    </span>
                    <span className="text-gray-400 text-sm flex items-center gap-1">
                        <FaClock /> {new Date(solicitud.fecha || solicitud.created_at).toLocaleDateString()}
                    </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800">
                    {solicitud.tipo} {solicitud.equipo ? `- ${solicitud.equipo}` : ''}
                </h3>
                
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <FaUser className="text-gray-400" />
                        <span className="font-medium">{solicitud.clientes?.nombre || 'Cliente'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-gray-400" />
                        <span>{solicitud.sedes?.nombre || 'Sede'}</span>
                    </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700 mt-2 border border-gray-100 italic">
                    "{solicitud.descripcion}"
                </div>
              </div>

              <div className="flex md:flex-col justify-end gap-3 min-w-160px">
                <button 
                    onClick={() => handleAprobar(solicitud)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
                >
                    <FaCheck /> Asignar Técnico
                </button>
                <button 
                    onClick={() => handleRechazar(solicitud.id)}
                    className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                    <FaTimes /> Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-200">
          <FaInbox className="mx-auto text-5xl text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-600">Estás al día</h3>
          <p className="text-gray-400">No hay nuevas solicitudes pendientes.</p>
        </div>
      )}

    </div>
  );
};

export default Solicitudes;