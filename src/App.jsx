import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Contexts
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Hooks
import Layout from './hooks/Layout';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';


// Páginas relacionadas a los equipos
import FichaTecnicaEquipo from './pages/equipos-pages/FichaTecnicaEquipo';
import EditarEquipo from './pages/equipos-pages/EditarEquipo';
import Equipos from './pages/Equipos';

// Páginas del cliente
import ClienteDashboard from './pages/clientes-pages/ClienteDashboad';
import MisSedes from './pages/clientes-pages/MisSedes';

// Páginas del técnico
import Servicios from './pages/Servicios';
import Calendario from './pages/Calendario';
import MisTrabajos from './pages/tecnico-pages/MisTrabajos';

// Páginas del admin
import Clientes from './pages/Clientes';
import Solicitudes from './pages/Solicitudes';
import Tecnicos from './pages/Tecnicos';
import Reportes from './pages/Reportes';
import Sedes from './pages/Sedes';

// Páginas generales
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';


// Landing Page
import Inicio from './pages/landing/Inicio';

const HomeRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loading fullScreen />;
  
  if (!user) return <Navigate to="/login" replace />;

  // Aquí está la magia: Redirección según ROL
  if (user.rol === 'cliente') {
    return <Navigate to="/clienteDashboard" replace />;
  } else {
    // Admins y Técnicos van al Dashboard general
      if (user.rol === 'admin') {
      return <Navigate to="/dashboard" replace/>;
    }
}};

// Layout principal
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Definimos qué es una pantalla grande (768px o más)
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    
    // Función que actualiza el estado según si cumple o no la condición
    const handleMediaChange = (e) => {
      setSidebarOpen(e.matches); 
    };

    // Lo ejecutamos inmediatamente al cargar
    handleMediaChange(mediaQuery);

    // Escuchamos si el usuario gira el teléfono
    mediaQuery.addEventListener('change', handleMediaChange);
    
    // Limpieza
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Ocultamos Sidebar para clientes (opcional, si quieres que tengan otro menú)
  // O lo dejamos si el Sidebar ya se adapta (que debería).
  // Por ahora asumimos que el Sidebar se muestra para todos.

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function AppContent() {
  const { notification, mostrarNotificacion, loading } = useApp();

  return (
    <>
      <Routes>
        {/* Ruta Pública (Landing) */}
        <Route path="/" element={<Inicio />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Rutas Privadas --- */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          
          {/* Ruta "Home" interna: El Portero decide a dónde vas */}
          <Route path="/home" element={<HomeRedirect />} />

          {/* Rutas Admin / Técnico */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'tecnico']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/solicitudes" element={
            <ProtectedRoute allowedRoles={['admin', 'tecnico']}>
              <Solicitudes />
            </ProtectedRoute>
          } />

          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/tecnicos" element={<Tecnicos />} />
          <Route path="/sedes" element={<Sedes />} />
          <Route path="/calendario" element={<Calendario />} />

          <Route path="/reportes" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Reportes />
            </ProtectedRoute>
          } />

          {/* Ruta Exclusiva Cliente */}
          <Route path="/clienteDashboard" element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <ClienteDashboard />
            </ProtectedRoute>
          } />
          <Route path="/misSedes" element={
            <ProtectedRoute allowedRoles={['cliente']}>
              <MisSedes clienteView={true} />
            </ProtectedRoute>
          } />

          {/* Ruta Exclusiva Técnico */}
          <Route path="/misTrabajos" element={
            <ProtectedRoute allowedRoles={['tecnico']}>
              <MisTrabajos />
            </ProtectedRoute>
          } />

          {/* Rutas de Equipos (Admin + Técnico) */}
          <Route path="/equipos" element={
            <ProtectedRoute allowedRoles={['admin', 'tecnico']}>
              <Equipos />
            </ProtectedRoute>
          } />
          <Route path="/equipos/:id" element={
            <ProtectedRoute allowedRoles={['admin', 'tecnico']}>
              <FichaTecnicaEquipo />
            </ProtectedRoute>
          } />
          <Route path="/equipos/:id/editar" element={
            <ProtectedRoute allowedRoles={['admin', 'tecnico']}>
              <EditarEquipo />
            </ProtectedRoute>
          } />
        </Route>

        {/* Catch-all: Si ponen una ruta rara, los mandamos al Portero para que los ubique */}
        <Route path="*" element={<HomeRedirect />} />
      </Routes>

      <Notification 
        notification={notification} 
        onClose={() => mostrarNotificacion(null)} 
      />
      
      {loading && <Loading fullScreen />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;