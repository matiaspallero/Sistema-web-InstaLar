import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTools, FaArrowRight } from 'react-icons/fa';
import { api } from '../services/api';

const WidgetTecnico = () => {
  const [pendientes, setPendientes] = useState(0);
  const [proximo, setProximo] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.tecnicos.getMisTrabajos();
        const data = Array.isArray(res) ? res : (res.data || []);
        
        // Contamos activos (asignado o en-proceso)
        const activos = data.filter(t => t.estado !== 'completado' && t.estado !== 'cancelado');
        setPendientes(activos.length);
        setProximo(activos[0]); // El primero de la lista (ya viene ordenado por fecha)
      } catch (e) { console.error(e); }
    };
    fetch();
  }, []);

  return (
    <div className="bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
            <FaTools /> Hola, Técnico
        </h3>
        <p className="text-blue-100 text-sm mb-6">Tienes {pendientes} trabajos pendientes.</p>

        {proximo ? (
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 mb-4">
                <p className="text-xs text-blue-200 uppercase tracking-wide font-bold mb-1">Próximo Trabajo</p>
                <p className="font-bold text-lg">{proximo.tipo}</p>
                <p className="text-sm text-blue-100 truncate">{proximo.clientes?.nombre} - {proximo.sedes?.nombre}</p>
            </div>
        ) : (
            <div className="h-24 flex items-center justify-center text-blue-200 bg-white/5 rounded-xl mb-4">
                Todo despejado ✅
            </div>
        )}

        <Link to="/misTrabajos" className="inline-flex items-center gap-2 font-bold hover:gap-3 transition-all">
            Ver mi agenda completa <FaArrowRight />
        </Link>
      </div>
      
      {/* Decoración de fondo */}
      <FaTools className="absolute -bottom-6 -right-6 text-9xl text-white/10 rotate-12" />
    </div>
  );
};

export default WidgetTecnico;