// PAGINA DE MIS TRABAJOS PARA TÉCNICOS
import { useState, useEffect } from 'react';
import { FaTools, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaChevronRight, FaCheckCircle, FaClock } from 'react-icons/fa';
import { api } from '../../services/api';
import { useApp } from '../../context/AppContext';
import Loading from '../../components/Loading';
import TecAtencionModal from '../../components/TecAtencionModal'; // Importamos el nuevo modal

const MisTrabajos = () => {
  const { mostrarNotificacion } = useApp();
  const [trabajos, setTrabajos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para el modal
  const [selectedTrabajo, setSelectedTrabajo] = useState(null);

  const cargarTrabajos = async () => {
    try {
      setLoading(true);
      const res = await api.tecnicos.getMisTrabajos();
      setTrabajos(Array.isArray(res) ? res : (res.data || []));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTrabajos();
  }, []);

  if (loading) return <Loading mensaje="Sincronizando agenda..." />;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Modal Inteligente */}
      {selectedTrabajo && (
        <TecAtencionModal 
          servicio={selectedTrabajo} 
          onClose={() => setSelectedTrabajo(null)}
          onSuccess={cargarTrabajos}
        />
      )}

      {/* Header Visual */}
      <div className="bg-linear-to-r from-blue-600 to-blue-800 p-8 rounded-3xl shadow-xl text-white flex justify-between items-end">
        <div>
           <h1 className="text-3xl font-bold mb-2">Mi Agenda Técnica</h1>
           <p className="text-blue-100 opacity-90">Tienes {trabajos.filter(t => t.estado !== 'completado').length} servicios activos</p>
        </div>
        <FaTools className="text-6xl text-white/10" />
      </div>

      {/* Grid de Tarjetas Limpias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trabajos.map((trabajo) => (
          <div 
            key={trabajo.id} 
            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col"
          >
            {/* Cabecera de Color según Estado */}
            <div className={`h-2 w-full ${
                trabajo.estado === 'en-proceso' ? 'bg-blue-500' :
                trabajo.estado === 'completado' ? 'bg-green-500' : 'bg-orange-400'
            }`}></div>

            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                        trabajo.estado === 'en-proceso' ? 'bg-blue-50 text-blue-600' :
                        trabajo.estado === 'completado' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                        {trabajo.estado.replace('-', ' ')}
                    </span>
                    <span className="text-gray-400 text-xs font-medium flex items-center gap-1">
                        <FaCalendarAlt /> {new Date(trabajo.fecha).toLocaleDateString()}
                    </span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors">
                    {trabajo.tipo}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{trabajo.equipo} - {trabajo.marca}</p>

                {/* Info Rápida */}
                <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                            <FaUser size={12} />
                        </div>
                        <span className="truncate font-medium">{trabajo.clientes?.nombre}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                            <FaMapMarkerAlt size={12} />
                        </div>
                        <span className="truncate">{trabajo.sedes?.nombre}</span>
                    </div>
                </div>

                {/* Botón Grande "Ver Más" */}
                <div className="mt-auto pt-4 border-t border-gray-50">
                    <button 
                        onClick={() => setSelectedTrabajo(trabajo)}
                        className="w-full cursor-pointer py-3 rounded-xl bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-700 font-bold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg"
                    >
                        Gestionar Servicio <FaChevronRight size={12} />
                    </button>
                </div>
            </div>
          </div>
        ))}

        {trabajos.length === 0 && (
            <div className="col-span-full py-20 text-center">
                <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-4xl text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-600">¡Todo despejado!</h3>
                <p className="text-gray-400">No tienes servicios asignados por ahora.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default MisTrabajos;