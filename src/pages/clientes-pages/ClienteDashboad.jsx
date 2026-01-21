import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api'; // Asegúrate de tener el método en api.js
import { FaPlus, FaTools, FaHistory, FaClock, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import SolicitarServicioModal from '../../components/SolicitarServicioModal';

const ClienteDashboard = () => {
  const { user } = useAuth();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('activos'); // 'activos' o 'historial'
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.id) cargarMisServicios();
  }, [user]);

  const cargarMisServicios = async () => {
    try {
      // Nota: Debes agregar este método a tu api.js (ver Paso 3)
      const res = await api.servicios.getByUser(user.id); 
      // Manejamos si devuelve array directo o { data: [...] }
      const data = Array.isArray(res) ? res : (res.data || []);
      setServicios(data);
    } catch (error) {
      console.error("Error cargando servicios", error);
    } finally {
      setLoading(false);
    }
  };

  // Cálculos para las tarjetas de resumen
  const pendientes = servicios.filter(s => s.estado === 'pendiente').length;
  const enProceso = servicios.filter(s => s.estado === 'en-proceso').length;
  const finalizados = servicios.filter(s => s.estado === 'completado').length;

  const Estados = {
    'pendiente': 'Pendiente',
    'en-proceso': 'En Proceso',
    'completado': 'Finalizado', // <--- Clave DB: 'completado' | Texto usuario: 'Finalizado'
    'cancelado': 'Cancelado'    // Agregamos este por si acaso
  };

  // Filtramos la lista según la pestaña seleccionada
  const listaVisible = servicios.filter(s => 
    filtro === 'activos' 
      ? (s.estado !== 'completado' && s.estado !== 'cancelado') // Si es activos, oculta completados y cancelados
      : (s.estado === 'completado' || s.estado === 'cancelado') // Si es historial, muéstralos
  );

  const getBadgeColor = (estado) => {
    const colores = {
      'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'en-proceso': 'bg-blue-100 text-blue-800 border-blue-200',
      'completado': 'bg-green-100 text-green-800 border-green-200',
      'cancelado': 'bg-red-100 text-red-800 border-red-200'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-8 animate-fade-in p-2 md:p-0 max-w-6xl mx-auto">
      
      {/* 1. BIENVENIDA */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hola, {user?.nombre} 👋</h1>
          <p className="text-blue-100 opacity-90">
            Bienvenido a tu portal de gestión. Aquí puedes ver el estado de tus equipos.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)} 
          className="bg-white text-blue-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition transform hover:scale-105 flex items-center gap-2 cursor-pointer"
        >
          <FaPlus /> Solicitar Servicio
        </button>
      </div>

      {/* 2. RESUMEN RÁPIDO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-yellow-50 rounded-full text-yellow-600"><FaExclamationCircle size={24} /></div>
          <div><p className="text-gray-500 text-sm">Pendientes</p><p className="text-2xl font-bold">{pendientes}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600"><FaTools size={24} /></div>
          <div><p className="text-gray-500 text-sm">En Curso</p><p className="text-2xl font-bold">{enProceso}</p></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-4 bg-green-50 rounded-full text-green-600"><FaCheckCircle size={24} /></div>
          <div><p className="text-gray-500 text-sm">Finalizados</p><p className="text-2xl font-bold">{finalizados}</p></div>
        </div>
      </div>

      {/* 3. LISTA DE SERVICIOS */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="flex border-b border-gray-200">
          <button 
            onClick={() => setFiltro('activos')}
            className={`flex-1 py-4 text-center font-semibold text-sm transition ${filtro === 'activos' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-center gap-2"><FaClock /> Servicios Activos</div>
          </button>
          <button 
            onClick={() => setFiltro('historial')}
            className={`flex-1 py-4 text-center font-semibold text-sm transition ${filtro === 'historial' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <div className="flex items-center justify-center gap-2"><FaHistory /> Historial</div>
          </button>
        </div>

        <div className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Cargando información...</div>
          ) : listaVisible.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <div className="bg-gray-100 p-4 rounded-full mb-3 text-gray-400"><FaTools size={30}/></div>
              <p className="text-gray-500 font-medium">No hay servicios en esta lista.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {listaVisible.map((servicio) => (
                <div key={servicio.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(servicio.estado)} uppercase`}>
                        {Estados[servicio.estado] || servicio.estado}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                         📅 {new Date(servicio.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">{servicio.descripcion || "Mantenimiento General"}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                       📍 Sede: <span className="font-medium">{servicio.sedes?.nombre || 'Sede Principal'}</span>
                    </p>
                    {servicio.tecnicos && (
                      <p className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 inline-block px-2 py-1 rounded">
                        🛠 Técnico: {servicio.tecnicos.nombre}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* RENDERIZAR MODAL */}
      {showModal && (
        <SolicitarServicioModal 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            cargarMisServicios(); // Recarga la lista tras guardar
          }}
        />
      )}
    </div>
  );
};

export default ClienteDashboard;