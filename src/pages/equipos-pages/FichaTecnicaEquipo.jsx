import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, FaTools, FaDownload, FaEdit, FaMapMarkerAlt, 
  FaCalendarAlt, FaPhone, FaHistory 
} from 'react-icons/fa';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import EquipoHistorialServicios from '../../components/EquipoHistorialServicios';

const FichaTecnicaEquipo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mostrarNotificacion } = useApp();

  const [equipo, setEquipo] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const resEquipo = await api.equipos.getById(id);
      setEquipo(Array.isArray(resEquipo) ? resEquipo[0] : resEquipo.data || resEquipo);

      const resServicios = await api.equipos.getHistorial(id);
      setServicios(Array.isArray(resServicios) ? resServicios : resServicios.data || []);
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error cargando ficha', 'error');
    } finally {
      setLoading(false);
    }
  };

  const puedeEditar = ['admin', 'tecnico'].includes(user?.rol);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Cargando ficha técnica...</p>
        </div>
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-bold text-xl">❌ Equipo no encontrado</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-700"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-4 hover:bg-white/20 px-3 py-1 rounded cursor-pointer transition"
          >
            <FaArrowLeft /> Volver
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                <FaTools /> Ficha Técnica del Equipo
              </h1>
              <p className="text-blue-100">
                {equipo.marca} {equipo.modelo} • {equipo.frigorias} F
              </p>
              <p className="text-blue-200 text-sm mt-1">
                Serie: <span className="font-mono font-bold">{equipo.serie}</span>
              </p>
            </div>

            {puedeEditar && (
              <button 
                onClick={() => navigate(`/equipos/${id}/editar`)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 cursor-pointer transition shadow-lg"
              >
                <FaEdit /> Editar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-5xl mx-auto py-8 px-4">
        
        {/* Tabs */}
        <div className="bg-white rounded-t-xl shadow-md border-b border-gray-200 flex">
          {['general', 'servicios'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 cursor-pointer py-4 font-semibold text-sm transition border-b-2 ${
                activeTab === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-blue-600'
              }`}
            >
              {tab === 'general' && '📋 General'}
              {tab === 'servicios' && <><FaHistory className="inline mr-2" />Historial</>}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div className="bg-white rounded-b-xl shadow-md p-8 space-y-8">
          
          {activeTab === 'general' && (
            <div className="space-y-8">
              
              {/* Especificaciones */}
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTools className="text-blue-600" /> Especificaciones Técnicas
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Marca', valor: equipo.marca },
                    { label: 'Modelo', valor: equipo.modelo },
                    { label: 'Tipo', valor: equipo.tipo },
                    { label: 'Frigorías', valor: `${equipo.frigorias} F` },
                    { label: 'Serie', valor: equipo.serie, span: 2 },
                    { label: 'Voltaje', valor: `${equipo.voltaje}V`, span: 2 }
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200 ${item.span ? `col-span-${item.span}` : ''}`}
                    >
                      <p className="text-xs font-bold text-gray-600 uppercase mb-1">{item.label}</p>
                      <p className={`font-bold ${item.label === 'Serie' ? 'font-mono text-sm' : 'text-lg'} text-gray-800`}>
                        {item.valor}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Ubicación */}
              <section className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-green-600" /> Ubicación
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase mb-1">Sede</p>
                    <p className="text-lg font-bold text-gray-800">{equipo.sedes?.nombre}</p>
                    <p className="text-sm text-gray-700 mt-1">{equipo.sedes?.direccion}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-bold uppercase mb-1">Cliente</p>
                    <p className="text-lg font-bold text-gray-800">{equipo.clientes?.nombre}</p>
                    <a 
                      href={`tel:${equipo.clientes?.telefono}`}
                      className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1 mt-1"
                    >
                      <FaPhone /> {equipo.clientes?.telefono}
                    </a>
                  </div>
                </div>
              </section>

              {/* Fechas */}
              <section className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-yellow-600" /> Timeline
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Instalación</span>
                    <span className="text-blue-600 font-bold">
                      {new Date(equipo.fecha_instalacion).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">Último Servicio</span>
                    <span className="text-purple-600 font-bold">
                      {servicios[0] 
                        ? new Date(servicios[0].created_at).toLocaleDateString('es-ES')
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </section>

              {/* Observaciones */}
              {equipo.observaciones_tecnicas && (
                <section className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h2 className="text-lg font-bold text-gray-800 mb-3">📝 Observaciones Técnicas</h2>
                  <p className="text-gray-700 leading-relaxed">{equipo.observaciones_tecnicas}</p>
                </section>
              )}
            </div>
          )}

          {activeTab === 'servicios' && (
            <EquipoHistorialServicios servicios={servicios} loading={loading} />
          )}
        </div>
      </div>
    </main>
  );
};

export default FichaTecnicaEquipo;