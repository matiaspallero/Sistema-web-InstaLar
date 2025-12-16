import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';

// Contexts
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Loading from './components/Loading';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

import Clientes from './pages/Clientes';
import Servicios from './pages/Servicios';
import Tecnicos from './pages/Tecnicos';
import Calendario from './pages/Calendario';
import Reportes from './pages/Reportes';
import Sedes from './pages/Sedes';

// Landing Page
import Inicio from './pages/landing/Inicio';

// Layout interno para usuarios logueados
// Esto asegura que el Sidebar/Navbar SOLO se vean si estás autenticado
const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Outlet renderiza la ruta hija seleccionada (Dashboard, Clientes, etc.) */}
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
        {/* --- Ruta Landing Page (Pública) --- */}
        <Route path="/" element={<Inicio />} />

        {/* --- Ruta Pública --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Rutas Privadas --- */}
        {/* Protegemos el Layout completo. Si no hay acceso, redirige a Login antes de cargar el Sidebar */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/tecnicos" element={<Tecnicos />} />
          <Route path="/sedes" element={<Sedes />} />
          <Route path="/calendario" element={<Calendario />} />

          {/* Ejemplo: Reportes solo para admin */}
          {/* Nota: Aquí anidamos otro ProtectedRoute solo para validar el rol */}
          <Route path="/reportes" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Reportes />
            </ProtectedRoute>
          } />
        </Route>

        {/* --- Redirecciones por defecto --- */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      {/* Componentes globales de UI */}
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