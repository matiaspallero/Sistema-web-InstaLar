import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import Loading from '../components/Loading';

// Este componente reemplaza la lógica visual de tu antiguo AppContent
function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { notification, mostrarNotificacion, loading } = useApp();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Outlet renderiza la página actual según la ruta */}
          <Outlet />
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

export default Layout;