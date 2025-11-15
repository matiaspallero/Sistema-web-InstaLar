import { useState } from 'react';
import { FaDownload, FaPrint, FaChartBar, FaChartLine, FaChartPie, FaCalendarAlt, FaFileExport } from 'react-icons/fa';

function Reportes() {
  const [fechaInicio, setFechaInicio] = useState('2024-01-01');
  const [fechaFin, setFechaFin] = useState('2024-11-14');
  const [tipoReporte, setTipoReporte] = useState('general');

  // Datos de ejemplo para los reportes
  const estadisticas = {
    serviciosRealizados: 245,
    serviciosPendientes: 18,
    clientesActivos: 45,
    ingresoTotal: 125000,
    promedioCalificacion: 4.7,
    tiempoPromedioServicio: '2.5 hrs'
  };

  const serviciosPorTipo = [
    { tipo: 'Mantenimiento Preventivo', cantidad: 120, porcentaje: 49 },
    { tipo: 'Reparación', cantidad: 75, porcentaje: 31 },
    { tipo: 'Instalación', cantidad: 35, porcentaje: 14 },
    { tipo: 'Revisión', cantidad: 15, porcentaje: 6 }
  ];

  const serviciosPorMes = [
    { mes: 'Enero', cantidad: 18 },
    { mes: 'Febrero', cantidad: 22 },
    { mes: 'Marzo', cantidad: 25 },
    { mes: 'Abril', cantidad: 20 },
    { mes: 'Mayo', cantidad: 28 },
    { mes: 'Junio', cantidad: 24 },
    { mes: 'Julio', cantidad: 26 },
    { mes: 'Agosto', cantidad: 23 },
    { mes: 'Septiembre', cantidad: 21 },
    { mes: 'Octubre', cantidad: 19 },
    { mes: 'Noviembre', cantidad: 19 }
  ];

  const topClientes = [
    { nombre: 'Empresa ABC', servicios: 45, monto: 28500 },
    { nombre: 'Hotel XYZ', servicios: 38, monto: 24200 },
    { nombre: 'Oficinas Central', servicios: 32, monto: 19800 },
    { nombre: 'Centro Comercial', servicios: 28, monto: 17600 },
    { nombre: 'Clínica San José', servicios: 25, monto: 15750 }
  ];

  const topTecnicos = [
    { nombre: 'Ana Martínez', servicios: 67, calificacion: 5.0 },
    { nombre: 'María García', servicios: 52, calificacion: 4.9 },
    { nombre: 'Juan Pérez', servicios: 45, calificacion: 4.8 },
    { nombre: 'Carlos López', servicios: 38, calificacion: 4.7 }
  ];

  const handleExportarPDF = () => {
    console.log('Exportando a PDF...');
    alert('Función de exportar a PDF en desarrollo');
  };

  const handleExportarExcel = () => {
    console.log('Exportando a Excel...');
    alert('Función de exportar a Excel en desarrollo');
  };

  const handleImprimir = () => {
    window.print();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Reportes y Estadísticas</h2>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleExportarPDF}
            className="bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <FaDownload /> PDF
          </button>
          <button 
            onClick={handleExportarExcel}
            className="bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <FaFileExport /> Excel
          </button>
          <button 
            onClick={handleImprimir}
            className="bg-linear-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg font-medium"
          >
            <FaPrint /> Imprimir
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tipo de Reporte
            </label>
            <select
              value={tipoReporte}
              onChange={(e) => setTipoReporte(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
            >
              <option value="general">General</option>
              <option value="servicios">Servicios</option>
              <option value="clientes">Clientes</option>
              <option value="tecnicos">Técnicos</option>
              <option value="financiero">Financiero</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-lg transition-all font-medium shadow-md hover:shadow-lg">
              Generar Reporte
            </button>
          </div>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-700 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Servicios Realizados</p>
              <h3 className="text-4xl font-bold">{estadisticas.serviciosRealizados}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
              <FaChartBar className="text-4xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-yellow-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Servicios Pendientes</p>
              <h3 className="text-4xl font-bold">{estadisticas.serviciosPendientes}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
              <FaCalendarAlt className="text-4xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-700 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Clientes Activos</p>
              <h3 className="text-4xl font-bold">{estadisticas.clientesActivos}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
              <FaChartPie className="text-4xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-700 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Ingreso Total</p>
              <h3 className="text-4xl font-bold">S/. {estadisticas.ingresoTotal.toLocaleString()}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
              <FaChartLine className="text-4xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-pink-500 to-red-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Calificación Promedio</p>
              <h3 className="text-4xl font-bold">{estadisticas.promedioCalificacion} ⭐</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
              <FaChartBar className="text-4xl" />
            </div>
          </div>
        </div>

        <div className="bg-linear-to-br from-indigo-500 to-indigo-700 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-2">Tiempo Promedio</p>
              <h3 className="text-4xl font-bold">{estadisticas.tiempoPromedioServicio}</h3>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-full backdrop-blur-sm">
              <FaCalendarAlt className="text-4xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y Tablas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Servicios por Tipo */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-linear-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Servicios por Tipo</h3>
            <p className="text-sm text-white opacity-90 mt-1">Distribución de servicios realizados</p>
          </div>
          <div className="p-6 space-y-4">
            {serviciosPorTipo.map((servicio, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">{servicio.tipo}</span>
                  <span className="text-sm font-bold text-gray-900 bg-blue-100 px-3 py-1 rounded-full">
                    {servicio.cantidad} ({servicio.porcentaje}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-linear-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-700 shadow-inner"
                    style={{ width: `${servicio.porcentaje}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Servicios por Mes */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-linear-to-r from-green-500 to-green-600 px-6 py-4">
            <h3 className="text-xl font-bold text-white">Servicios por Mes</h3>
            <p className="text-sm text-white opacity-90 mt-1">Tendencia mensual del año 2024</p>
          </div>
          <div className="p-6 space-y-3">
            {serviciosPorMes.map((mes, index) => {
              const maxCantidad = Math.max(...serviciosPorMes.map(m => m.cantidad));
              const porcentaje = (mes.cantidad / maxCantidad) * 100;
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700 w-28">{mes.mes}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-9 relative overflow-hidden">
                    <div 
                      className="bg-linear-to-r from-green-500 to-green-600 h-9 rounded-full flex items-center justify-end pr-3 transition-all duration-700 shadow-inner"
                      style={{ width: `${porcentaje}%` }}
                    >
                      <span className="text-white text-sm font-bold">{mes.cantidad}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Clientes y Técnicos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Clientes */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-linear-to-r from-purple-500 to-purple-600 p-6 text-white">
            <h3 className="text-xl font-bold">Top 5 Clientes</h3>
            <p className="text-sm opacity-90 mt-1">Por cantidad de servicios realizados</p>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-sm font-bold text-gray-700">#</th>
                  <th className="text-left py-3 text-sm font-bold text-gray-700">Cliente</th>
                  <th className="text-center py-3 text-sm font-bold text-gray-700">Servicios</th>
                  <th className="text-right py-3 text-sm font-bold text-gray-700">Monto</th>
                </tr>
              </thead>
              <tbody>
                {topClientes.map((cliente, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-purple-50 transition-colors">
                    <td className="py-4 text-gray-600 font-semibold">{index + 1}</td>
                    <td className="py-4 font-semibold text-gray-900">{cliente.nombre}</td>
                    <td className="py-4 text-center">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-bold">
                        {cliente.servicios}
                      </span>
                    </td>
                    <td className="py-4 text-right font-bold text-green-600">
                      S/. {cliente.monto.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Técnicos */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-linear-to-r from-orange-500 to-red-600 p-6 text-white">
            <h3 className="text-xl font-bold">Top Técnicos</h3>
            <p className="text-sm opacity-90 mt-1">Por cantidad de servicios completados</p>
          </div>
          <div className="p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-sm font-bold text-gray-700">#</th>
                  <th className="text-left py-3 text-sm font-bold text-gray-700">Técnico</th>
                  <th className="text-center py-3 text-sm font-bold text-gray-700">Servicios</th>
                  <th className="text-center py-3 text-sm font-bold text-gray-700">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topTecnicos.map((tecnico, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-orange-50 transition-colors">
                    <td className="py-4 text-gray-600 font-semibold">{index + 1}</td>
                    <td className="py-4 font-semibold text-gray-900">{tecnico.nombre}</td>
                    <td className="py-4 text-center">
                      <span className="bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-sm font-bold">
                        {tecnico.servicios}
                      </span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="text-yellow-500 font-bold text-base">
                        ⭐ {tecnico.calificacion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reportes;