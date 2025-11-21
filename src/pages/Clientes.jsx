import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUser } from 'react-icons/fa';
import { api } from '../services/api';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCliente, setEditingCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    ruc: ''
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      setLoading(true);
      const data = await api.clientes.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      alert('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      contacto: cliente.contacto || '',
      email: cliente.email,
      telefono: cliente.telefono || '',
      direccion: cliente.direccion || '',
      ciudad: cliente.ciudad || '',
      ruc: cliente.ruc || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este cliente?')) {
      try {
        await api.clientes.delete(id);
        setClientes(clientes.filter(c => c.id !== id));
        alert('Cliente eliminado correctamente');
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        alert('Error al eliminar el cliente');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCliente) {
        const updated = await api.clientes.update(editingCliente.id, formData);
        setClientes(clientes.map(c => c.id === editingCliente.id ? updated : c));
        alert('Cliente actualizado correctamente');
      } else {
        const newCliente = await api.clientes.create(formData);
        setClientes([...clientes, newCliente]);
        alert('Cliente creado correctamente');
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      alert('Error al guardar el cliente');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCliente(null);
    setFormData({
      nombre: '',
      contacto: '',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      ruc: ''
    });
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
      {/* Header responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Gestión de Clientes</h2>
        <button 
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md text-sm md:text-base cursor-pointer"
        >
          <FaPlus /> Nuevo Cliente
        </button>
      </div>

      {/* Buscador responsive */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-4 md:mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm md:text-base" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 md:pl-12 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          />
        </div>
      </div>

      {/* Tabla con scroll horizontal en móvil */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-linear-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold uppercase">Cliente</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold uppercase">Contacto</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold uppercase">Email</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold uppercase">Teléfono</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-left text-xs md:text-sm font-bold uppercase">Ciudad</th>
                <th className="px-3 md:px-6 py-3 md:py-4 text-center text-xs md:text-sm font-bold uppercase">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="bg-blue-100 p-1.5 md:p-2 rounded-full shrink-0">
                        <FaUser className="text-blue-600 text-xs md:text-base" />
                      </div>
                      <span className="font-semibold text-gray-900 text-xs md:text-sm truncate max-w-[120px] md:max-w-none">
                        {cliente.nombre}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 text-xs md:text-sm">
                    {cliente.contacto || '-'}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 text-xs md:text-sm">
                    <span className="truncate block max-w-[150px] md:max-w-none" title={cliente.email}>
                      {cliente.email}
                    </span>
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 text-xs md:text-sm">
                    {cliente.telefono || '-'}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4 text-gray-600 text-xs md:text-sm">
                    {cliente.ciudad || '-'}
                  </td>
                  <td className="px-3 md:px-6 py-3 md:py-4">
                    <div className="flex justify-center gap-1 md:gap-2">
                      <button 
                        onClick={() => handleEdit(cliente)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-1.5 md:p-2 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <FaEdit className="text-xs md:text-base" />
                      </button>
                      <button 
                        onClick={() => handleDelete(cliente.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 md:p-2 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <FaTrash className="text-xs md:text-base" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Indicador de scroll en móvil */}
        <div className="sm:hidden bg-gray-50 text-center py-2 text-xs text-gray-500">
          ← Desliza para ver más →
        </div>
      </div>

      {filteredClientes.length === 0 && (
        <div className="bg-white rounded-xl shadow-md text-center py-8 md:py-12 mt-4 md:mt-6">
          <p className="text-gray-500 text-sm md:text-lg">No se encontraron clientes</p>
        </div>
      )}

      {/* Modal responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
            <div className="bg-linear-to-r from-blue-600 to-blue-700 p-4 md:p-6 text-white sticky top-0 z-10">
              <h3 className="text-xl md:text-2xl font-bold">
                {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    Nombre / Empresa *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="Empresa ABC S.A.C."
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    Persona de Contacto
                  </label>
                  <input
                    type="text"
                    value={formData.contacto}
                    onChange={(e) => setFormData({...formData, contacto: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="Juan Pérez"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="contacto@empresa.com"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="987654321"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    CUIT / RUC
                  </label>
                  <input
                    type="text"
                    value={formData.ruc}
                    onChange={(e) => setFormData({...formData, ruc: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="20123456789"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.ciudad}
                    onChange={(e) => setFormData({...formData, ciudad: e.target.value})}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                    placeholder="Lima"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-2">
                  Dirección
                </label>
                <textarea
                  value={formData.direccion}
                  onChange={(e) => setFormData({...formData, direccion: e.target.value})}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  rows="3"
                  placeholder="Av. Principal 123, San Isidro"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm md:text-base cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm md:text-base cursor-pointer"
                >
                  {editingCliente ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clientes;