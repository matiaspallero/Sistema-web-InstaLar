import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { FaBuilding, FaMapMarkerAlt, FaInfoCircle, FaPhone } from 'react-icons/fa';

const MisSedes = () => {
  const { user } = useAuth();
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) cargarSedes();
  }, [user]);

  const cargarSedes = async () => {
    try {
      const res = await api.sedes.getByUser(user.id);
      const data = Array.isArray(res) ? res : (res.data || []);
      setSedes(data);
    } catch (error) {
      console.error("Error al cargar sedes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto p-2 md:p-0">
      
      {/* HEADER INFORMATIVO (Sin botones de acción) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaBuilding className="text-blue-600" /> Mis Sedes Habilitadas
          </h1>
          <p className="text-gray-500 text-sm">Aquí verás las sucursales donde podemos brindarte servicio.</p>
        </div>
        
        {/* Aviso de Contacto */}
        <div className="bg-blue-50 text-blue-800 px-4 py-3 rounded-lg text-sm flex items-center gap-3 border border-blue-100 max-w-md">
          <FaInfoCircle className="text-xl shrink-0" />
          <div>
            <p className="font-bold">¿Necesitas agregar una nueva sucursal?</p>
            <p className="text-blue-700">Por favor, comunícate con administración para darla de alta en el sistema.</p>
          </div>
        </div>
      </div>

      {/* LISTA DE SEDES */}
      {loading ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm">
          <p className="animate-pulse">Cargando información...</p>
        </div>
      ) : sedes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
          <FaMapMarkerAlt className="mx-auto text-4xl text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-600">No tienes sedes asignadas</h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">
            Actualmente no tienes locales registrados. Si esto es un error, contacta soporte.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sedes.map((sede) => (
            <div key={sede.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100 group relative overflow-hidden">
              {/* Decoración lateral */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-blue-600 shrink-0">
                  <FaBuilding size={24} />
                </div>
                <div className="w-full">
                  <h3 className="font-bold text-gray-800 text-lg truncate" title={sede.nombre}>
                    {sede.nombre}
                  </h3>

                  <h3 className="text-gray-600 text-sm mt-1">
                    {sede.equipos} Equipo{sede.equipos_count !== 1 ? 's' : ''}
                  </h3>
                  
                  <div className="mt-3 space-y-2">
                    <p className="text-gray-600 text-sm flex items-start gap-2">
                      <FaMapMarkerAlt className="text-gray-400 mt-1 shrink-0" /> 
                      <span className="line-clamp-2">{sede.direccion}</span>
                    </p>
                    {sede.ciudad && (
                      <span className="inline-block text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded border border-gray-200">
                        {sede.ciudad}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisSedes;