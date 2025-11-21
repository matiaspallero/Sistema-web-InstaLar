import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaUsers, 
  FaTools, 
  FaUserTie, 
  FaBuilding, 
  FaCalendarAlt, 
  FaChartBar,
  FaBars // Importamos la hamburguesa
} from 'react-icons/fa';

// Recibe 'isOpen' y 'onToggle' desde AppContent
function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/clientes', icon: FaUsers, label: 'Clientes' },
    { path: '/servicios', icon: FaTools, label: 'Servicios' },
    { path: '/tecnicos', icon: FaUserTie, label: 'Técnicos' },
    { path: '/sedes', icon: FaBuilding, label: 'Sedes' },
    { path: '/calendario', icon: FaCalendarAlt, label: 'Calendario' },
    { path: '/reportes', icon: FaChartBar, label: 'Reportes' }
  ];

  return (
    <>
      <aside 
        className={`
          bg-linear-to-b from-gray-800 to-gray-900 text-white shadow-2xl
          h-screen shrink-0 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* Encabezado del Sidebar */}
        <div 
          className={`
            border-b border-gray-700 flex items-center justify-between
            transition-all duration-300
            ${isOpen ? 'p-5' : 'py-5 px-3'} 
          `}
        >
          {/* Muestra el logo (grande o pequeño) */}
          {isOpen ? (
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-500 whitespace-nowrap">
              InstaLar
            </h1>
          ) : (
            <img 
              src="/logo.png" 
              alt="InstaLar Logo" 
              className="w-8 h-8 object-contain" // Logo más pequeño (w-8)
            />
          )}
          
          {/* Botón de hamburguesa con padding condicional */}
          <button 
            onClick={onToggle} 
            className={`
              text-gray-400 hover:text-white rounded-lg hover:bg-gray-700
              ${isOpen ? 'p-2' : 'p-1'}
            `}
          >
            <FaBars className="text-xl" />
          </button>
        </div>

        {/* Menú de navegación */}
        <nav className="mt-6 overflow-y-auto h-[calc(100vh-85px)] pb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-4 py-4 transition-all
                  ${isActive 
                    ? 'bg-linear-to-r from-blue-600 to-blue-700 border-l-4 border-blue-400 shadow-lg' 
                    : 'hover:bg-gray-700 border-l-4 border-transparent'
                  }
                  ${isOpen ? 'px-6' : 'justify-center px-3'}
                `}
                title={!isOpen ? item.label : ''}
              >
                <Icon 
                  className={`
                    text-xl shrink-0 
                    ${isActive ? 'text-blue-200' : 'text-gray-400'}
                  `} 
                />
                
                {isOpen && (
                  <span className={`font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-300'}`}>
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;