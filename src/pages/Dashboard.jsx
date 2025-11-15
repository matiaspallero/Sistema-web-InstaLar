import { useState, useEffect } from 'react';
import { FaUsers, FaTools, FaCheckCircle, FaClock } from 'react-icons/fa';

function Dashboard() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    serviciosActivos: 0,
    serviciosCompletados: 0,
    serviciosPendientes: 0
  });

  const [serviciosRecientes, setServiciosRecientes] = useState([]);

  useEffect(() => {
    // Simular carga de datos
    setStats({
      totalClientes: 45,
      serviciosActivos: 12,
      serviciosCompletados: 128,
      serviciosPendientes: 8
    });

    setServiciosRecientes([
      {
        id: 1,
        cliente: 'Empresa ABC',
        servicio: 'Mantenimiento Preventivo',
        tecnico: 'Juan Pérez',
        estado: 'completado',
        fecha: '13/11/2024'
      },
      {
        id: 2,
        cliente: 'Hotel XYZ',
        servicio: 'Reparación',
        tecnico: 'María García',
        estado: 'en-proceso',
        fecha: '14/11/2024'
      },
      {
        id: 3,
        cliente: 'Oficinas Central',
        servicio: 'Instalación',
        tecnico: 'Carlos López',
        estado: 'pendiente',
        fecha: '15/11/2024'
      }
    ]);
  }, []);

  const statCards = [
    {
      title: 'Clientes Totales',
      value: stats.totalClientes,
      icon: FaUsers,
      gradient: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-500',
      iconBg: 'bg-purple-600'
    },
    {
      title: 'Servicios Activos',
      value: stats.serviciosActivos,
      icon: FaTools,
      gradient: 'from-pink-500 to-red-500',
      bgColor: 'bg-pink-500',
      iconBg: 'bg-pink-600'
    },
    {
      title: 'Completados',
      value: stats.serviciosCompletados,
      icon: FaCheckCircle,
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500',
      iconBg: 'bg-blue-600'
    },
    {
      title: 'Pendientes',
      value: stats.serviciosPendientes,
      icon: FaClock,
      gradient: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500',
      iconBg: 'bg-yellow-600'
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
                <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
                  <Icon className="text-3xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Servicios Recientes */}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {servicio.servicio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {servicio.tecnico}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoBadge(servicio.estado)}`}>
                      {getEstadoTexto(servicio.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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