import { useState, useEffect } from 'react';
import { FaUsers, FaTools, FaCheckCircle, FaClock } from 'react-icons/fa';
import { api } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    serviciosActivos: 0,
    serviciosCompletados: 0,
    serviciosPendientes: 0
  });

  const [serviciosRecientes, setServiciosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Obtener todos los datos necesarios
      const [clientes, servicios] = await Promise.all([
        api.clientes.getAll(),
        api.servicios.getAll()
      ]);

      // Calcular estadísticas
      const serviciosActivos = servicios.filter(s => s.estado === 'en-proceso').length;
      const serviciosCompletados = servicios.filter(s => s.estado === 'completado').length;
      const serviciosPendientes = servicios.filter(s => s.estado === 'pendiente').length;

      setStats({
        totalClientes: clientes.length,
        serviciosActivos,
        serviciosCompletados,
        serviciosPendientes
      });

      // Obtener los 5 servicios más recientes
      const serviciosFormateados = servicios
        .slice(0, 5)
        .map(servicio => ({
          id: servicio.id,
          cliente: servicio.clientes?.nombre || 'Sin cliente',
          servicio: servicio.tipo,
          tecnico: servicio.tecnicos?.nombre || 'Sin asignar',
          estado: servicio.estado,
          fecha: new Date(servicio.fecha).toLocaleDateString('es-ES')
        }));

      setServiciosRecientes(serviciosFormateados);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Clientes Totales',
      value: stats.totalClientes,
      icon: FaUsers,
      gradient: 'from-purple-500 to-purple-700'
    },
    {
      title: 'Servicios Activos',
      value: stats.serviciosActivos,
      icon: FaTools,
      gradient: 'from-pink-500 to-red-500'
    },
    {
      title: 'Completados',
      value: stats.serviciosCompletados,
      icon: FaCheckCircle,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Pendientes',
      value: stats.serviciosPendientes,
      icon: FaClock,
      gradient: 'from-yellow-500 to-orange-500'
    }
  ];

  const getEstadoBadge = (estado) => {
    const badges = {
      'completado': 'bg-green-100 text-green-800',
      'en-proceso': 'bg-yellow-100 text-yellow-800',
      'pendiente': 'bg-red-100 text-red-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoTexto = (estado) => {
    const textos = {
      'completado': 'Completado',
      'en-proceso': 'En Proceso',
      'pendiente': 'Pendiente'
    };
    return textos[estado] || estado;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Panel de Control</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className={`bg-linear-to-br ${stat.gradient} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90 mb-2">{stat.title}</p>
                  <h3 className="text-4xl font-bold">{stat.value}</h3>
                </div>
                <div className="bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
                  <Icon className="text-3xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-linear-to-r from-blue-500 to-blue-600">
          <h3 className="text-xl font-semibold text-white">Servicios Recientes</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Servicio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Técnico
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {serviciosRecientes.map((servicio) => (
                <tr key={servicio.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {servicio.cliente}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600">
                    {servicio.servicio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600">
                    {servicio.tecnico}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${getEstadoBadge(servicio.estado)}`}>
                      {getEstadoTexto(servicio.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-600">
                    {servicio.fecha}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;