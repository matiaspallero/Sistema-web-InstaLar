import { useState } from 'react';
import { FaBell, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext'; // 1. Importamos el contexto
import { useNavigate } from 'react-router-dom';   // 2. Para redirigir al salir

function Navbar() {
  const { user, logout } = useAuth(); // 3. Sacamos datos y función
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();           // Limpia el token y el estado
    navigate('/login'); // Manda al usuario a la entrada
    setShowProfileMenu(false);
  };

  return (
    <nav className="bg-white shadow-md px-4 md:px-6 py-3 md:py-4 flex justify-between items-center sticky top-0 z-30">
      
      {/* Logo / Título */}
      <div className="flex items-center gap-3 md:gap-4">
        <h2 className="text-base md:text-xl font-semibold text-gray-800 truncate">
          <span className="hidden sm:inline">Sistema de Gestión - Mantenimiento A/C</span>
          <span className="sm:hidden">InstaLar</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        
        {/* Notificaciones (Visual por ahora) */}
        <button className="relative p-2 hover:bg-gray-100 cursor-pointer rounded-full transition-colors">
          <FaBell className="text-gray-600 text-lg md:text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Menú de Perfil */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-gray-100 p-1 md:p-2 rounded-lg transition-colors outline-none"
          >
            <FaUserCircle className="text-gray-600 text-2xl md:text-3xl" />
            
            {/* Nombre y Rol Dinámicos */}
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800">
                {user?.nombre || 'Usuario'} 
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.rol || 'Invitado'}
              </p>
            </div>
            
            <FaChevronDown className={`hidden md:block text-gray-400 text-sm transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown */}
          {showProfileMenu && (
            <>
              {/* Overlay invisible para cerrar al hacer clic afuera */}
              <div 
                className="fixed inset-0 z-10 cursor-default" 
                onClick={() => setShowProfileMenu(false)}
              />
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-20 border border-gray-100 animate-fade-in">
                <div className="px-4 py-2 border-b border-gray-100 md:hidden">
                  <p className="text-sm font-bold text-gray-800">{user?.nombre}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
                </div>

                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                  Mi Perfil
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors">
                  Configuración
                </a>
                
                <hr className="my-2 border-gray-100" />
                
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium cursor-pointer"
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;