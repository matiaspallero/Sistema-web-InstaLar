import { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaTools, FaCheckCircle, FaChartPie } from 'react-icons/fa';
import { api } from '../services/api';

function Reportes() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalServicios: 0,
    serviciosCompletados: 0,
    serviciosPendientes: 0,
    serviciosEnProceso: 0,
    totalClientes: 0,
    totalTecnicos: 0
  });

  const [serviciosPorMes, setServiciosPorMes] = useState([]);
  const [tecnicosTop, setTecnicosTop] = useState([]);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      setLoading(true);

      const [serviciosRes, clientesRes, tecnicosRes] = await Promise.all([
        api.servicios.getAll(),
        api.clientes.getAll(),
        api.tecnicos.getAll()
      ]);

      // Extraer los arrays de las respuestas, manejando diferentes formatos
      const servicios = Array.isArray(serviciosRes) ? serviciosRes : (serviciosRes?.data || []);
      const clientes = Array.isArray(clientesRes) ? clientesRes : (clientesRes?.data || []);
      const tecnicos = Array.isArray(tecnicosRes) ? tecnicosRes : (tecnicosRes?.data || []);

      setStats({
        totalServicios: servicios.length,
        serviciosCompletados: servicios.filter(s => s.estado === 'completado').length,
        serviciosPendientes: servicios.filter(s => s.estado === 'pendiente').length,
        serviciosEnProceso: servicios.filter(s => s.estado === 'en-proceso').length,
        totalClientes: clientes.length,
        totalTecnicos: tecnicos.length
      });

      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const serviciosPorMesData = Array(6).fill(0).map((_, i) => {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() - (5 - i));
        const mes = fecha.getMonth();
        const año = fecha.getFullYear();
        
        const count = servicios.filter(s => {
          const servicioDate = new Date(s.fecha);
          return servicioDate.getMonth() === mes && servicioDate.getFullYear() === año;
        }).length;

        return {
          mes: meses[mes],
          servicios: count
        };
      });
      setServiciosPorMes(serviciosPorMesData);

      const tecnicosConServicios = tecnicos.map(tecnico => ({
        nombre: tecnico.nombre,
        servicios: servicios.filter(s => s.tecnico_id === tecnico.id).length
      })).sort((a, b) => b.servicios - a.servicios).slice(0, 5);
      setTecnicosTop(tecnicosConServicios);

    } catch (error) {
      console.error('Error al cargar reportes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const maxServicios = Math.max(...serviciosPorMes.map(m => m.servicios), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
        <div className="p-3 bg-blue-50 rounded-full text-blue-600">
          <FaChartPie className="text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Reportes y Estadísticas</h2>
          <p className="text-gray-500 text-sm">Resumen general del rendimiento</p>
        </div>
      </div>

      {/* KPI CARDS (Grid 4 columnas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Servicios */}
        <div className="bg-linear-to-br from-blue-500 to-blue-700 rounded-xl shadow-md p-6 text-white relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">Total Servicios</p>
            <h3 className="text-3xl font-bold">{stats.totalServicios}</h3>
          </div>
          <FaChartBar className="absolute -bottom-2 -right-2 text-6xl text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>

        {/* Completados */}
        <div className="bg-linear-to-br from-green-500 to-green-700 rounded-xl shadow-md p-6 text-white relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="relative z-10">
            <p className="text-green-100 text-sm font-medium mb-1">Completados</p>
            <h3 className="text-3xl font-bold">{stats.serviciosCompletados}</h3>
          </div>
          <FaCheckCircle className="absolute -bottom-2 -right-2 text-6xl text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>

        {/* En Proceso */}
        <div className="bg-linear-to-br from-orange-400 to-orange-600 rounded-xl shadow-md p-6 text-white relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="relative z-10">
            <p className="text-orange-100 text-sm font-medium mb-1">En Proceso</p>
            <h3 className="text-3xl font-bold">{stats.serviciosEnProceso}</h3>
          </div>
          <FaTools className="absolute -bottom-2 -right-2 text-6xl text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>

        {/* Clientes */}
        <div className="bg-linear-to-br from-purple-500 to-purple-700 rounded-xl shadow-md p-6 text-white relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="relative z-10">
            <p className="text-purple-100 text-sm font-medium mb-1">Cartera Clientes</p>
            <h3 className="text-3xl font-bold">{stats.totalClientes}</h3>
          </div>
          <FaUsers className="absolute -bottom-2 -right-2 text-6xl text-white opacity-20 group-hover:scale-110 transition-transform" />
        </div>
      </div>

      {/* SECCIÓN INFERIOR (Gráficos y Listas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICO DE BARRAS (Ocupa 2 columnas) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <FaChartBar className="text-blue-500" /> Rendimiento Semestral
            </h3>
          </div>
          
          <div className="flex items-end justify-between h-64 gap-3 md:gap-6 px-2">
            {serviciosPorMes.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-blue-100 rounded-t-lg relative transition-all duration-500 ease-out group-hover:bg-blue-200" 
                  style={{ height: `${(data.servicios / maxServicios) * 100}%`, minHeight: '8px' }}
                >
                  {/* Tooltip con valor */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.servicios} Serv.
                  </div>
                  
                  {/* Barra rellena */}
                  <div className="w-full h-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t-lg opacity-90 group-hover:opacity-100"></div>
                </div>
                <div className="mt-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {data.mes}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP TÉCNICOS (Ocupa 1 columna) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FaTools className="text-orange-500" /> Top Técnicos
          </h3>
          
          <div className="space-y-5">
            {tecnicosTop.length > 0 ? (
              tecnicosTop.map((tecnico, index) => (
                <div key={index} className="flex items-center gap-4">
                  {/* Badge de Posición */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm
                    ${index === 0 ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                      index === 1 ? 'bg-gray-100 text-gray-600 border border-gray-200' : 
                      index === 2 ? 'bg-orange-50 text-orange-700 border border-orange-100' : 
                      'bg-blue-50 text-blue-600'}`}
                  >
                    {index + 1}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-gray-700 text-sm truncate">{tecnico.nombre}</span>
                      <span className="text-xs font-bold text-gray-500">{tecnico.servicios} serv.</span>
                    </div>
                    {/* Barra de progreso mini */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-yellow-400' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(tecnico.servicios / (tecnicosTop[0]?.servicios || 1)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 text-sm py-4">No hay datos de técnicos</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Reportes;