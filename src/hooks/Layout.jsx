import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Notification from '../components/Notification';
import Loading from '../components/Loading';

// Este componente reemplaza la lógica visual de tu antiguo AppContent
function Layout() {
  // 1. ESTADO PARA CONTROLAR EL SIDEBAR
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notification, mostrarNotificacion, loading } = useApp();

  // 2. NUEVO: Agregamos el useEffect que vigila el tamaño real de la pantalla
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