import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';

// Contexts
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useAuth();

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