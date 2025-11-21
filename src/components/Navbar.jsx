import { FaBell, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { useState } from 'react';

function Navbar() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <nav className="bg-white shadow-md px-4 md:px-6 py-3 md:py-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center gap-3 md:gap-4">
        <h2 className="text-base md:text-xl font-semibold text-gray-800 truncate">
          <span className="hidden sm:inline">Sistema de Gestión - Mantenimiento A/C</span>
          <span className="sm:hidden">InstaLar</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 md:gap-6">
        {/* Notificaciones */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <FaBell className="text-gray-600 text-lg md:text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Perfil */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 md:gap-3 hover:bg-gray-100 p-1 md:p-2 rounded-lg transition-colors"
          >
            <FaUserCircle className="text-gray-600 text-2xl md:text-3xl" />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">Administrador</p>
            </div>
            <FaChevronDown className="hidden md:block text-gray-400 text-sm" />
          </button>

          {showProfileMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Mi Perfil
                </a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  Configuración
                </a>
                <hr className="my-2" />
                <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                  Cerrar Sesión
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;