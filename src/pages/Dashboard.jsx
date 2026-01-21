import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import Loading from '../components/Loading';
//import TecAtencionModal from '../components/TecAtencionModal';
import AdminAsignacionModal from '../components/AdminAsignacionModal';
import { 
  FaUsers, 
  FaTools, 
  FaClipboardList, 
  FaCheckCircle, 
  FaExclamationTriangle,
  FaCalendarAlt,
  FaPlus,
  FaArrowRight,
  FaMapMarkerAlt
} from 'react-icons/fa';

// ==========================================
// 1. DASHBOARD DE ADMINISTRADOR
// ==========================================
const AdminDashboard = () => {
  const { mostrarNotificacion } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalClientes: 0,
    serviciosPendientes: 0,
    serviciosEnProceso: 0,
    tecnicosDisponibles: 0
  });
  const [loading, setLoading] = useState(true);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  const cargarDatos = async () => {
    try {
      // Cargamos todo en paralelo
      const [resClientes, resServicios, resTecnicos, resSolicitudes] = await Promise.all([
        api.clientes.getAll(),
        api.servicios.getAll(),
        api.tecnicos.getAll(),
        api.solicitudes.getAll()
      ]);

      // 2. NORMALIZACIÓN DE DATOS (El truco mágico 🎩)
      // Si viene {data: [...]}, usamos .data. Si es un array directo, lo usamos tal cual. Si falla, array vacío.
      const clientes = resClientes.data || (Array.isArray(resClientes) ? resClientes : []);
      const servicios = resServicios.data || (Array.isArray(resServicios) ? resServicios : []);
      const tecnicos = resTecnicos.data || (Array.isArray(resTecnicos) ? resTecnicos : []);
      const solicitudes = resSolicitudes.data || (Array.isArray(resSolicitudes) ? resSolicitudes : []);

      // 3. Calculamos KPIs
      setStats({
        totalClientes: clientes.length,
        serviciosPendientes: solicitudes.filter(s => s.estado === 'pendiente').length,
        serviciosEnProceso: servicios.filter(s => s.estado === 'en-proceso').length,
        tecnicosDisponibles: tecnicos.filter(t => t.estado === 'disponible').length
      });

      // 4. Guardamos la lista de pendientes
      setSolicitudesPendientes(solicitudes.filter(s => s.estado === 'pendiente'));

    } catch (error) {
      console.error("Error cargando dashboard admin:", error);
      mostrarNotificacion('Error cargando datos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) return <Loading mensaje="Analizando datos globales..." />;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* MODAL DE ASIGNACIÓN */}
      {selectedSolicitud && (
        <AdminAsignacionModal 
          solicitud={selectedSolicitud}
          onClose={() => setSelectedSolicitud(null)}
          onSuccess={() => {
            cargarDatos(); // Recargar tablas y KPIs
          }}
        />
      )}

      {/* Hero de Bienvenida */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
          <p className="text-sm text-gray-500">Vista general de operaciones</p>
        </div>
        <button 
          onClick={cargarDatos}
          className="text-blue-600 text-sm hover:underline cursor-pointer"
        >
          Actualizar datos ↻
        </button>
      </div>

      {/* --- KPIs (Tarjetas Superiores) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Clientes</p>
              <h3 className="text-3xl font-bold text-gray-800">{stats.totalClientes}</h3>
            </div>
            <FaUsers className="text-blue-200 text-3xl" />
          </div>
        </div>

        {/* Tarjeta de Pendientes (Clickeable si quieres llevar a una vista detallada) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Solicitudes Nuevas</p>
              <h3 className="text-3xl font-bold text-yellow-600">{stats.serviciosPendientes}</h3>
            </div>
            <FaExclamationTriangle className="text-yellow-200 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">En Ejecución</p>
              <h3 className="text-3xl font-bold text-green-600">{stats.serviciosEnProceso}</h3>
            </div>
            <FaTools className="text-green-200 text-3xl" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Técnicos Libres</p>
              <h3 className="text-3xl font-bold text-purple-600">{stats.tecnicosDisponibles}</h3>
            </div>
            <FaCheckCircle className="text-purple-200 text-3xl" />
          </div>
        </div>
      </div>

      {/* --- ÁREA DE TRABAJO: SOLICITUDES PENDIENTES --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Tabla de Pendientes */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
              Solicitudes por Asignar
            </h3>
            <span className="text-xs font-semibold bg-gray-200 px-2 py-1 rounded-full text-gray-600">
              {solicitudesPendientes.length} pendientes
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs text-gray-500 border-b border-gray-100">
                  <th className="px-6 py-3 font-semibold uppercase">Cliente / Sede</th>
                  <th className="px-6 py-3 font-semibold uppercase">Tipo / Problema</th>
                  <th className="px-6 py-3 font-semibold uppercase">Fecha</th>
                  <th className="px-6 py-3 font-semibold uppercase text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {solicitudesPendientes.length > 0 ? (
                  solicitudesPendientes.map(sol => (
                    <tr key={sol.id} className="hover:bg-blue-50/50 transition-colors border-b border-gray-50 last:border-0">
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-800">{sol.clientes?.nombre}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FaMapMarkerAlt size={10} /> {sol.sedes?.nombre}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                         <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-bold uppercase mb-1 inline-block">
                           {sol.tipo_servicio}
                         </span>
                         <p className="text-gray-600 truncate max-w-[150px]" title={sol.descripcion}>
                           {sol.descripcion}
                         </p>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(sol.created_at).toLocaleDateString()}
                        {sol.prioridad === 'urgente' && (
                          <span className="block text-red-500 text-xs font-bold">URGENTE</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => navigate(`/solicitudes`)}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-700 shadow-sm transition-transform hover:scale-105"
                        >
                          Asignar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                      <FaCheckCircle className="mx-auto text-4xl mb-2 text-green-100" />
                      <p>¡Todo al día! No hay solicitudes pendientes.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Columna Derecha: Accesos Rápidos */}
        <div className="space-y-6">
          <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-2">Gestión de Técnicos</h3>
            <p className="text-gray-400 text-sm mb-4">
              Administra tu personal, crea nuevos usuarios técnicos y revisa su rendimiento.
            </p>
            <Link to="/tecnicos" className="block w-full text-center bg-gray-700 hover:bg-gray-600 py-2 rounded-lg text-sm font-bold transition">
              Ir a Técnicos
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-500" /> Calendario
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Visualiza la carga de trabajo semanal y reprograma visitas si es necesario.
            </p>
            <Link to="/calendario" className="block w-full text-center border border-gray-200 hover:bg-gray-50 py-2 rounded-lg text-sm font-bold text-gray-700 transition">
              Ver Agenda Completa
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. DASHBOARD DE TÉCNICO
// ==========================================
const TecnicoDashboard = ({ user }) => {
  const [misServicios, setMisServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const cargarAgenda = async () => {
    try {
      setLoading(true);
      const res = await api.tecnicos.getMisTrabajos();
      const datos = Array.isArray(res) ? res : (res.data || []);
      
      // 1. Filtramos los cancelados
      const activos = datos.filter(s => s.estado !== 'cancelado');

      // 2. ORDENAMIENTO PERSONALIZADO 🧠
      // Definimos el "peso" de cada estado (mientras menor el número, más arriba sale)
      const prioridad = {
        'en-proceso': 1,  // ¡Lo más importante arriba! 🔥
        'pendiente': 2,   // Después lo pendiente
        'completado': 3   // Al final lo terminado ✅
      };

      const ordenados = activos.sort((a, b) => {
        const pesoA = prioridad[a.estado] || 4; // Si no tiene estado, va al final
        const pesoB = prioridad[b.estado] || 4;
        return pesoA - pesoB;
      });
      
      setMisServicios(ordenados);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAgenda();
  }, [user]);

  if (loading) return <Loading mensaje="Cargando tu agenda..." />;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Hero de Bienvenida */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">¡Hola, {user.nombre}! 👋</h1>
           <p className="text-gray-500 mt-1">Aquí tienes tu hoja de ruta para hoy.</p>
        </div>
        <div className="text-right hidden sm:block">
           <p className="text-xs text-gray-400 uppercase font-bold">Estado</p>
           <span className="inline-flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full border border-green-200">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Disponible
           </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna de Agenda */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-gray-800 flex items-center gap-2">
            <FaClipboardList className="text-blue-600" /> Servicios Asignados
          </h2>
          
          {misServicios.length > 0 ? (
            misServicios.map(servicio => (
              <div 
                key={servicio.id} 
                onClick={() => navigate(`/misTrabajos`)} // <--- CLICK PARA ABRIR MODAL
                className="bg-white p-4 rounded-xl border-l-4 border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer hover:bg-blue-50/30 group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                      {servicio.tipo || 'Servicio Técnico'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 font-medium">
                      {servicio.clientes?.nombre || 'Cliente'} - {servicio.sedes?.nombre || 'Sede'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 italic line-clamp-1">"{servicio.descripcion}"</p>
                    
                    <div className="flex gap-3 mt-3 text-xs text-gray-500">
                      <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                        📅 {servicio.fecha}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                        ⏰ {servicio.hora}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                      servicio.estado === 'en-proceso' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                      servicio.estado === 'completado' ? 'bg-green-100 text-green-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {servicio.estado === 'en-proceso' ? 'En Curso' : 
                       servicio.estado === 'completado' ? 'Finalizado' : 'Pendiente'}
                    </span>
                    <span className="text-xs text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Gestionar →
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-xl text-center border-2 border-dashed border-gray-200">
              <FaCheckCircle className="mx-auto text-4xl text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No tienes servicios pendientes.</p>
              <p className="text-sm text-gray-400">¡Buen trabajo!</p>
            </div>
          )}
        </div>

        {/* Columna de Resumen Rápido */}
        <div className="space-y-6">
          <div className="bg-linear-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg">
            <p className="text-blue-100 text-sm font-medium">Completados (Hoy)</p>
            <p className="text-4xl font-bold mt-2">
              {misServicios.filter(s => s.estado === 'completado').length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
             <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Recordatorios</h3>
             <ul className="text-sm space-y-3 text-gray-600">
               <li className="flex gap-2">
                 <span className="text-blue-500">•</span> Subir fotos antes de cerrar orden.
               </li>
               <li className="flex gap-2">
                 <span className="text-blue-500">•</span> Confirmar dirección con cliente.
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. COMPONENTE PRINCIPAL (ROUTER)
// ==========================================
function Dashboard() {
  const { user } = useAuth();

  // Si no hay usuario cargado aún (raro porque ProtectedRoute lo maneja), mostramos loading
  if (!user) return <Loading mensaje="Cargando perfil..." />;

  // Renderizado condicional según el rol
  switch (user.rol) {
    case 'admin':
      return <AdminDashboard />;
    case 'tecnico':
      return <TecnicoDashboard user={user} />;
    default:
      // Fallback por seguridad
      return (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-xl font-bold text-gray-800">Rol no identificado</h2>
          <p className="text-gray-500">Tu usuario no tiene un rol asignado correctamente.</p>
        </div>
      );
  }
}

export default Dashboard;