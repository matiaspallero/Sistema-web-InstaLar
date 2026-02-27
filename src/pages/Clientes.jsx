import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUser, FaTimes, FaBuilding, FaIdCard, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { api } from '../services/api';
import Loading from '../components/Loading'; // Usamos tu componente de carga visual
import { useApp } from '../context/AppContext'; // Para notificaciones bonitas en vez de alerts

function Clientes() {
  const { mostrarNotificacion } = useApp(); // Usamos esto para mejorar la UX visual
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCliente, setEditingCliente] = useState(null);
  
  // Tu estructura de datos exacta
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
      // Tu lógica de respuesta exacta
      setClientes(Array.isArray(data) ? data : (data.clientes || data.data || []));
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      mostrarNotificacion('Error al cargar los clientes', 'error');
      setClientes([]); 
    } finally {
      setLoading(false);
    }
  };

  const filteredClientes = Array.isArray(clientes) 
    ? clientes.filter(cliente =>
        cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

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
        mostrarNotificacion('Cliente eliminado correctamente', 'success');
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
        mostrarNotificacion('Error al eliminar el cliente', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCliente) {
        const updated = await api.clientes.update(editingCliente.id, formData);
        // Ajuste visual: actualizamos la lista localmente para que se vea rápido
        setClientes(clientes.map(c => c.id === editingCliente.id ? (updated.data || updated) : c)); 
        mostrarNotificacion('Cliente actualizado correctamente', 'success');
      } else {
        const newCliente = await api.clientes.create(formData);
        // Ajuste visual: agregamos a la lista
        setClientes([...clientes, (newCliente.data || newCliente)]);
        mostrarNotificacion('Cliente creado correctamente', 'success');
      }
      
      handleCloseModal();
      // Recarga de seguridad
      cargarClientes();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      mostrarNotificacion('Error al guardar el cliente', 'error');
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
    return <Loading mensaje="Cargando cartera de clientes..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* HEADER VISUAL MEJORADO */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             <FaUser className="text-blue-600" /> Gestión de Clientes
          </h2>
          <p className="text-gray-500 text-sm">Administra tu base de datos de usuarios</p>
        </div>
        
        <div className="flex w-full md:w-auto gap-3">
          {/* Barra de búsqueda estilizada */}
          <div className="relative w-full md:w-100">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      {/* TABLA ESTILIZADA */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-bold border-b border-gray-200">
                <th className="px-6 py-4">Cliente / Contacto</th>
                <th className="px-6 py-4">Datos de Contacto</th>
                <th className="px-6 py-4">Ubicación / RUC</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {filteredClientes.length > 0 ? (
                filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {cliente.nombre ? cliente.nombre.charAt(0).toUpperCase() : <FaUser />}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800">{cliente.nombre}</p>
                          {cliente.contacto && (
                            <p className="text-xs text-blue-600 font-medium flex items-center gap-1">
                              <FaUser size={10} /> {cliente.contacto}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaEnvelope className="text-gray-400" size={12} />
                          <span className="truncate max-w-[150px]" title={cliente.email}>{cliente.email}</span>
                        </div>
                        {cliente.telefono && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <FaPhone className="text-gray-400" size={12} />
                            <span>{cliente.telefono}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                         {(cliente.direccion || cliente.ciudad) && (
                           <div className="flex items-start gap-2 text-gray-600">
                             <FaMapMarkerAlt className="text-red-400 mt-1" size={12} />
                             <span className="text-xs">
                               {cliente.direccion} {cliente.ciudad ? `(${cliente.ciudad})` : ''}
                             </span>
                           </div>
                         )}
                         {cliente.ruc && (
                           <div className="flex items-center gap-2 text-gray-500 text-xs">
                             <FaIdCard className="text-gray-400" />
                             <span>RUC: {cliente.ruc}</span>
                           </div>
                         )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2 opacity-100 sm:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(cliente)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          onClick={() => handleDelete(cliente.id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <FaUser className="text-4xl text-gray-200 mb-2" />
                      <p>No se encontraron clientes.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer simple */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
           <span>Total: {filteredClientes.length} registros</span>
        </div>
      </div>

      {/* MODAL ESTILIZADO */}
    </div>
  );
}

export default Clientes;