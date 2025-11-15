import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import ClienteForm from '../components/ClienteForm';

function Clientes() {
  const [clientes, setClientes] = useState([
    { id: 1, nombre: 'Empresa ABC', contacto: 'Juan Pérez', telefono: '555-0101', email: 'juan@abc.com', direccion: 'Av. Principal 123' },
    { id: 2, nombre: 'Hotel XYZ', contacto: 'María García', telefono: '555-0102', email: 'maria@xyz.com', direccion: 'Calle 45 #67' },
    { id: 3, nombre: 'Oficinas Central', contacto: 'Carlos López', telefono: '555-0103', email: 'carlos@central.com', direccion: 'Centro Comercial Piso 5' }
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.contacto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <FaPlus /> Nuevo Cliente
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{cliente.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cliente.contacto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cliente.telefono}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{cliente.email}</td>
                  <td className="px-6 py-4 text-gray-600">{cliente.direccion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center gap-2">
                      <button className="text-blue-600 hover:text-blue-800 p-2">
                        <FaEdit />
                      </button>
                      <button className="text-red-600 hover:text-red-800 p-2">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <ClienteForm onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}

export default Clientes;