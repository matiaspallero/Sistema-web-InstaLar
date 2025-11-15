import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUsers, FaTools, FaUserTie, FaCalendarAlt, FaChartBar, FaBuilding } from 'react-icons/fa';

function Sidebar({ isOpen }) {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FaHome, label: 'Dashboard' },
    { path: '/clientes', icon: FaUsers, label: 'Clientes' },
    { path: '/servicios', icon: FaTools, label: 'Servicios' },
    { path: '/tecnicos', icon: FaUserTie, label: 'Técnicos' },
    { path: '/sedes', icon: FaBuilding, label: 'Sedes' },
    { path: '/calendario', icon: FaCalendarAlt, label: 'Calendario' },
    { path: '/reportes', icon: FaChartBar, label: 'Reportes' },
  ];

  return (
    <aside className={`bg-gray-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-6 border-b border-gray-700 flex items-center justify-center">
        {isOpen ? (
          <h2 className="text-2xl font-bold text-center">InstaLar</h2>
        ) : (
          <img 
            src="/logo.png" 
            alt="InstaLar Logo" 
            className="w-10 h-10 object-contain"
          />
        )}
      </div>
      
      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-4 transition-colors duration-200 ${
                isActive 
                  ? 'bg-gray-700 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-700'
              }`}
            >
              <Icon className="text-xl min-w-6" />
              {isOpen && <span className="ml-4">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;