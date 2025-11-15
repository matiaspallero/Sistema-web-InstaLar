import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe ser usado dentro de AppProvider');
  }
  return context;
};

export function AppProvider({ children }) {
  const [clientes, setClientes] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [sedes, setSedes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  const cargarDatosIniciales = () => {
    // Datos de ejemplo - aquí conectarías con tu API
    setClientes([
      { id: 1, nombre: 'Empresa ABC', contacto: 'Juan Pérez', telefono: '555-0101', email: 'juan@abc.com', direccion: 'Av. Principal 123' },
      { id: 2, nombre: 'Hotel XYZ', contacto: 'María García', telefono: '555-0102', email: 'maria@xyz.com', direccion: 'Calle 45 #67' },
    ]);

    setTecnicos([
      { id: 1, nombre: 'Juan Pérez', especialidad: 'Instalación', telefono: '555-1001', email: 'juan.perez@instalar.com', estado: 'disponible' },
      { id: 2, nombre: 'María García', especialidad: 'Reparación', telefono: '555-1002', email: 'maria.garcia@instalar.com', estado: 'ocupado' },
    ]);
  };

  // CRUD Clientes
  const agregarCliente = (cliente) => {
    const nuevoCliente = { ...cliente, id: Date.now() };
    setClientes([...clientes, nuevoCliente]);
    mostrarNotificacion('Cliente agregado exitosamente', 'success');
    return nuevoCliente;
  };

  const actualizarCliente = (id, clienteActualizado) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, ...clienteActualizado } : c));
    mostrarNotificacion('Cliente actualizado exitosamente', 'success');
  };

  const eliminarCliente = (id) => {
    setClientes(clientes.filter(c => c.id !== id));
    mostrarNotificacion('Cliente eliminado exitosamente', 'success');
  };

  // CRUD Servicios
  const agregarServicio = (servicio) => {
    const nuevoServicio = { ...servicio, id: Date.now() };
    setServicios([...servicios, nuevoServicio]);
    mostrarNotificacion('Servicio programado exitosamente', 'success');
    return nuevoServicio;
  };

  const actualizarServicio = (id, servicioActualizado) => {
    setServicios(servicios.map(s => s.id === id ? { ...s, ...servicioActualizado } : s));
    mostrarNotificacion('Servicio actualizado exitosamente', 'success');
  };

  const eliminarServicio = (id) => {
    setServicios(servicios.filter(s => s.id !== id));
    mostrarNotificacion('Servicio eliminado exitosamente', 'success');
  };

  // CRUD Técnicos
  const agregarTecnico = (tecnico) => {
    const nuevoTecnico = { ...tecnico, id: Date.now() };
    setTecnicos([...tecnicos, nuevoTecnico]);
    mostrarNotificacion('Técnico agregado exitosamente', 'success');
    return nuevoTecnico;
  };

  const actualizarTecnico = (id, tecnicoActualizado) => {
    setTecnicos(tecnicos.map(t => t.id === id ? { ...t, ...tecnicoActualizado } : t));
    mostrarNotificacion('Técnico actualizado exitosamente', 'success');
  };

  const eliminarTecnico = (id) => {
    setTecnicos(tecnicos.filter(t => t.id !== id));
    mostrarNotificacion('Técnico eliminado exitosamente', 'success');
  };

  // CRUD Sedes
  const agregarSede = (sede) => {
    const nuevaSede = { ...sede, id: Date.now() };
    setSedes([...sedes, nuevaSede]);
    mostrarNotificacion('Sede agregada exitosamente', 'success');
    return nuevaSede;
  };

  const actualizarSede = (id, sedeActualizada) => {
    setSedes(sedes.map(s => s.id === id ? { ...s, ...sedeActualizada } : s));
    mostrarNotificacion('Sede actualizada exitosamente', 'success');
  };

  const eliminarSede = (id) => {
    setSedes(sedes.filter(s => s.id !== id));
    mostrarNotificacion('Sede eliminada exitosamente', 'success');
  };

  // Sistema de notificaciones
  const mostrarNotificacion = (mensaje, tipo = 'info') => {
    setNotification({ mensaje, tipo });
    setTimeout(() => setNotification(null), 3000);
  };

  const value = {
    // Estados
    clientes,
    servicios,
    tecnicos,
    sedes,
    loading,
    notification,
    // Métodos Clientes
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    // Métodos Servicios
    agregarServicio,
    actualizarServicio,
    eliminarServicio,
    // Métodos Técnicos
    agregarTecnico,
    actualizarTecnico,
    eliminarTecnico,
    // Métodos Sedes
    agregarSede,
    actualizarSede,
    eliminarSede,
    // Utilidades
    mostrarNotificacion,
    setLoading
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}