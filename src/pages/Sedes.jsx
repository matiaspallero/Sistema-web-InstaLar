import { useState } from 'react';
import { FaPlus, FaSearch, FaFilter, FaBuilding } from 'react-icons/fa';
import SedeCard from '../components/SedeCard';

function Sedes() {
  const [sedes, setSedes] = useState([
    {
      id: 1,
      nombre: 'Sede Central',
      cliente: 'Empresa ABC',
      direccion: 'Av. Principal 123, Piso 5',
      ciudad: 'Lima',
      equipos: 15,
      ultimoMantenimiento: '2024-10-15',
      proximoMantenimiento: '2024-12-15',
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'Recepción',
      cliente: 'Hotel XYZ',
      direccion: 'Calle Comercio 456',
      ciudad: 'Lima',
      equipos: 8,
      ultimoMantenimiento: '2024-11-01',
      proximoMantenimiento: '2025-01-01',
      estado: 'activo'
    },
    {
      id: 3,
      nombre: 'Piso 3 - Oficinas',
      cliente: 'Oficinas Central',
      direccion: 'Centro Empresarial, Torre A',
      ciudad: 'Callao',
      equipos: 12,
      ultimoMantenimiento: '2024-09-20',
      proximoMantenimiento: '2024-11-20',
      estado: 'mantenimiento-pendiente'
    },
    {
      id: 4,
      nombre: 'Sala de Juntas',
      cliente: 'Empresa ABC',
      direccion: 'Av. Principal 123, Piso 8',
      ciudad: 'Lima',
      equipos: 6,
      ultimoMantenimiento: '2024-10-30',
      proximoMantenimiento: '2024-12-30',
      estado: 'activo'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCliente, setSelectedCliente] = useState('todos');

  const clientes = ['todos', ...new Set(sedes.map(sede => sede.cliente))];

  const filteredSedes = sedes.filter(sede => {
    const matchSearch = sede.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       sede.direccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       sede.ciudad.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCliente = selectedCliente === 'todos' || sede.cliente === selectedCliente;
    return matchSearch && matchCliente;
  });

  const handleEdit = (id) => {
    console.log('Editar sede:', id);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar esta sede?')) {
      setSedes(sedes.filter(s => s.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Sedes</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <FaPlus /> Nueva Sede
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar sedes por nombre, dirección o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={selectedCliente}
              onChange={(e) => setSelectedCliente(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              {clientes.map(cliente => (
                <option key={cliente} value={cliente}>
                  {cliente === 'todos' ? 'Todos los Clientes' : cliente}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Grid de Sedes usando map() */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSedes.map((sede) => (
          <SedeCard 
            key={sede.id} 
            sede={sede}
            onEdit={() => handleEdit(sede.id)}
            onDelete={() => handleDelete(sede.id)}
          />
        ))}
      </div>

      {filteredSedes.length === 0 && (
        <div className="bg-white rounded-xl shadow-md text-center py-12">
          <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No se encontraron sedes</p>
        </div>
      )}
    </div>
  );
}

export default Sedes;