import { FaBars, FaBell, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';

function Navbar({ toggleSidebar }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    console.log('Cerrar sesión');
    // Aquí implementarás la lógica de logout en el futuro
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="text-gray-700 hover:text-gray-900 focus:outline-none"
          >
            <FaBars className="text-2xl" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            Sistema de Gestión - Mantenimiento A/C
          </h1>
        </div>
        
        <div className="flex items-center gap-6">
          <button className="relative text-gray-600 hover:text-gray-800 transition-colors">
            <FaBell className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
          
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
            >
              <FaUserCircle className="text-3xl text-gray-600" />
              <span className="text-gray-700 font-medium">Admin</span>
              <FaChevronDown className={`text-gray-600 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <button className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-3">
                  <FaUserCircle className="text-gray-600" />
                  <span>Mi Perfil</span>
                </button>
                <hr className="my-2 border-gray-200" />
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;