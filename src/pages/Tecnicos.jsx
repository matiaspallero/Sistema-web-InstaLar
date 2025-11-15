import { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import TecnicoCard from '../components/TecnicoCard';

function Tecnicos() {
  const [tecnicos, setTecnicos] = useState([
    {
      id: 1,
      nombre: 'Juan Pérez',
      especialidad: 'Instalación y Mantenimiento',
      telefono: '555-1001',
      email: 'juan.perez@instalar.com',
      estado: 'disponible',
      serviciosActivos: 3,
      serviciosCompletados: 45,
      calificacion: 4.8
    },
    {
      id: 2,
      nombre: 'María García',
      especialidad: 'Reparación y Diagnóstico',
      telefono: '555-1002',
      email: 'maria.garcia@instalar.com',
      estado: 'ocupado',
      serviciosActivos: 5,
      serviciosCompletados: 52,
      calificacion: 4.9
    },
    {
      id: 3,
      nombre: 'Carlos López',
      especialidad: 'Instalación',
      telefono: '555-1003',
      email: 'carlos.lopez@instalar.com',
      estado: 'disponible',
      serviciosActivos: 2,
      serviciosCompletados: 38,
      calificacion: 4.7
    },
    {
      id: 4,
      nombre: 'Ana Martínez',
      especialidad: 'Mantenimiento Preventivo',
      telefono: '555-1004',
      email: 'ana.martinez@instalar.com',
      estado: 'disponible',
      serviciosActivos: 4,
      serviciosCompletados: 67,
      calificacion: 5.0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filteredTecnicos = tecnicos.filter(tecnico =>
    tecnico.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tecnico.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (id) => {
    console.log('Editar técnico:', id);
    // Aquí puedes abrir un modal o navegar a una página de edición
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Está seguro de eliminar este técnico?')) {
      setTecnicos(tecnicos.filter(t => t.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Gestión de Técnicos</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-md"
        >
          <FaPlus /> Nuevo Técnico
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar técnicos por nombre o especialidad..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Grid de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTecnicos.map((tecnico) => (
          <TecnicoCard 
            key={tecnico.id} 
            tecnico={tecnico}
            onEdit={() => handleEdit(tecnico.id)}
            onDelete={() => handleDelete(tecnico.id)}
          />
        ))}
      </div>

      {filteredTecnicos.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg">No se encontraron técnicos</p>
        </div>
      )}
    </div>
  );
}

export default Tecnicos;