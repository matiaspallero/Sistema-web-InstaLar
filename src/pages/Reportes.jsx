import { useState, useEffect } from 'react';
import { FaChartBar, FaUsers, FaTools, FaCheckCircle } from 'react-icons/fa';
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

      const [servicios, clientes, tecnicos] = await Promise.all([
        api.servicios.getAll(),
        api.clientes.getAll(),
        api.tecnicos.getAll()
      ]);

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
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8">
        Reportes y Estadísticas
      </h2>

      {/* Estadísticas Generales - Responsive */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <div className="bg-linear-to-br from-blue-500 to-blue-700 rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm opacity-90 mb-1 md:mb-2">Total Servicios</p>
              <h3 className="text-2xl md:text-4xl font-bold">{stats.totalServicios}</h3>
            </div>
            <FaChartBar className="text-2xl md:text-4xl opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-700 rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm opacity-90 mb-1 md:mb-2">Completados</p>
              <h3 className="text-2xl md:text-4xl font-bold">{stats.serviciosCompletados}</h3>
            </div>
            <FaCheckCircle className="text-2xl md:text-4xl opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-yellow-500 to-orange-500 rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm opacity-90 mb-1 md:mb-2">En Proceso</p>
              <h3 className="text-2xl md:text-4xl font-bold">{stats.serviciosEnProceso}</h3>
            </div>
            <FaTools className="text-2xl md:text-4xl opacity-80" />
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-700 rounded-lg md:rounded-xl shadow-lg p-3 md:p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm opacity-90 mb-1 md:mb-2">Total Clientes</p>
              <h3 className="text-2xl md:text-4xl font-bold">{stats.totalClientes}</h3>
            </div>
            <FaUsers className="text-2xl md:text-4xl opacity-80" />
          </div>
        </div>
      </div>

      {/* Gráfico de Servicios por Mes - Responsive */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">
          Servicios por Mes
        </h3>
        <div className="flex items-end justify-between h-48 md:h-64 gap-2 md:gap-4">
          {serviciosPorMes.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-blue-200 rounded-t-lg relative" style={{ height: `${(data.servicios / maxServicios) * 100}%`, minHeight: '20px' }}>
                <div className="absolute -top-5 md:-top-6 left-0 right-0 text-center text-xs md:text-sm font-semibold text-gray-700">
                  {data.servicios}
                </div>
                <div className="w-full h-full bg-linear-to-t from-blue-600 to-blue-400 rounded-t-lg"></div>
              </div>
              <div className="mt-2 text-xs md:text-sm font-semibold text-gray-600">
                {data.mes}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Técnicos - Responsive */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">
          Top 5 Técnicos
        </h3>
        <div className="space-y-3 md:space-y-4">
          {tecnicosTop.map((tecnico, index) => (
            <div key={index} className="flex items-center gap-3 md:gap-4">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs md:text-base shrink-0">
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800 text-sm md:text-base truncate">
                    {tecnico.nombre}
                  </span>
                  <span className="text-blue-600 font-bold text-sm md:text-base ml-2 shrink-0">
                    {tecnico.servicios} servicios
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                  <div
                    className="bg-linear-to-r from-blue-500 to-blue-700 h-1.5 md:h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(tecnico.servicios / (tecnicosTop[0]?.servicios || 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reportes;