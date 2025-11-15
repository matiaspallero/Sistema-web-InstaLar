import { Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import Loading from './components/Loading';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Servicios from './pages/Servicios';
import Tecnicos from './pages/Tecnicos';
import Calendario from './pages/Calendario';
import Reportes from './pages/Reportes';
import Sedes from './pages/Sedes';

function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { notification, mostrarNotificacion, loading } = useApp();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={sidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/tecnicos" element={<Tecnicos />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/sedes" element={<Sedes />} />
          </Routes>
        </main>
      </div>

      <Notification 
        notification={notification} 
        onClose={() => mostrarNotificacion(null)} 
      />
      
      {loading && <Loading fullScreen />}
      
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;