import { useState, useEffect } from 'react';
import { FaTimes, FaTools, FaMapMarkerAlt, FaCalendarAlt } from 'react-icons/fa';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import EquipoHistorialServicios from './EquipoHistorialServicios';
import QRCode from 'react-qr-code';

const EquipoFicha = ({ equipoId, onClose }) => {
  const { user } = useAuth();
  const { mostrarNotificacion } = useApp();
  const [equipo, setEquipo] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    cargarDatos();
  }, [equipoId]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resEquipo = await api.equipos.getById(equipoId);
      setEquipo(Array.isArray(resEquipo) ? resEquipo[0] : resEquipo.data);

      const resServicios = await api.equipos.getHistorial(equipoId);
      setServicios(Array.isArray(resServicios) ? resServicios : resServicios.data || []);
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error cargando ficha técnica', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Validar acceso
  const tieneAcceso = ['admin', 'tecnico'].includes(user?.rol) || user?.cliente_id === equipo?.cliente_id;

  if (!tieneAcceso) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 text-center shadow-xl">
          <p className="text-red-600 font-bold text-lg">❌ Acceso Denegado</p>
          <p className="text-gray-600 mt-2">No tienes permiso para ver esta ficha</p>
          <button 
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-xl">Cargando...</div>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 text-center shadow-xl">
          <p className="text-red-600 font-bold">Equipo no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-linear-to-r from-blue-600 to-purple-600 p-6 text-white flex justify-between items-start sticky top-0">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaTools /> Ficha Técnica
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {equipo.marca} {equipo.modelo} • {equipo.frigorias} F
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded cursor-pointer transition">
            <FaTimes size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white sticky top-[70px] z-10">
          {['general', 'servicios'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 cursor-pointer py-3 font-semibold text-sm transition ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {tab === 'general' && '📋 General'}
              {tab === 'servicios' && '🔧 Servicios'}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto flex-1">
          
          {activeTab === 'general' && (
            <div className="space-y-4">
              
              {/* Datos técnicos */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-gray-800 mb-3">Especificaciones</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600 font-bold uppercase text-xs">Marca</p>
                    <p className="font-bold text-gray-800">{equipo.marca}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-bold uppercase text-xs">Modelo</p>
                    <p className="font-bold text-gray-800">{equipo.modelo}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-bold uppercase text-xs">Serie</p>
                    <p className="font-mono text-xs font-bold text-gray-800">{equipo.serie}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-bold uppercase text-xs">Frigorías</p>
                    <p className="font-bold text-gray-800">{equipo.frigorias} F</p>
                  </div>
                </div>
              </div>

              {/* Ubicación */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" /> Ubicación
                </h3>
                <p className="text-sm text-gray-700"><strong>{equipo.sedes?.nombre}</strong></p>
                <p className="text-xs text-gray-600">{equipo.sedes?.direccion}</p>
              </div>

              {/* Fecha */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <FaCalendarAlt className="text-yellow-600" /> Instalación
                </h3>
                <p className="text-sm font-bold text-gray-800">
                  {new Date(equipo.fecha_instalacion).toLocaleDateString('es-ES')}
                </p>
              </div>

              {/* Observaciones */}
              {equipo.observaciones_tecnicas && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-gray-800 mb-2">📝 Notas Técnicas</h3>
                  <p className="text-sm text-gray-700">{equipo.observaciones_tecnicas}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'servicios' && (
            <EquipoHistorialServicios servicios={servicios} loading={loading} />
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-100 p-4 border-t flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EquipoFicha;