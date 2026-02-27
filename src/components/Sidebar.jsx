import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- IMPORTANTE
import { 
  FaHome, 
  FaUsers, 
  FaTools, 
  FaUserTie, 
  FaBuilding, 
  FaCalendarAlt, 
  FaChartBar,
  FaBars,
  FaInbox,
  FaWrench,
  FaTimes,
} from 'react-icons/fa';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { user } = useAuth(); // Obtenemos el usuario para saber su rol

  // Definimos todos los ítems y QUÉ ROLES pueden verlos
  const allMenuItems = [
    // 1. DASHBOARD PRINCIPAL (admin/tecnico)
    { 
      path: '/dashboard', 
      icon: FaHome, 
      label: 'Dashboard', 
      roles: ['admin', 'tecnico']
    },
    // 2. DASHBOARD CLIENTE (cliente)
    {
      path: '/clienteDashboard',
      icon: FaUsers,
      label: 'Clientes Dashboard',
      roles: ['cliente']
    },
    // 3. GESTIÓN DE SOLICITUDES (admin/tecnicos)
    { 
      path: '/solicitudes', 
      icon: FaInbox, 
      label: 'Solicitudes', 
      roles: ['admin']
    },
    // 4. GESTIÓN (admin/tecnico)
    { 
      path: '/clientes', 
      icon: FaUsers, 
      label: 'Clientes', 
      roles: ['admin', 'tecnico']
    },
    // 5. MIS TRABAJOS (tecnico)
    {
      path: '/misTrabajos',
      icon: FaWrench,
      label: 'Mis Trabajos',
      roles: ['tecnico']
    },
    // 6. GESTIÓN DE SERVICIOS (admin/tecnico)
    { 
      path: '/servicios', 
      icon: FaTools, 
      label: 'Servicios', 
      roles: ['admin', 'tecnico']
    },
    // 7. GESTIÓN DE TÉCNICOS (admin)
    { 
      path: '/tecnicos', 
      icon: FaUserTie, 
      label: 'Técnicos', 
      roles: ['admin']
    },
    // 8. GESTIÓN DE SEDES (admin)
    { 
      path: '/sedes', 
      icon: FaBuilding, 
      label: 'Sedes', 
      roles: ['admin']
    },
    // 9. MIS SEDES (cliente)
    {
      path: '/misSedes', 
      icon: FaBuilding, 
      label: 'Mis Sedes', 
      roles: ['cliente']
    },
    // 10. CALENDARIO (admin/tecnico)
    { 
      path: '/calendario', 
      icon: FaCalendarAlt, 
      label: 'Calendario', 
      roles: ['admin', 'tecnico']
    },
    // 11. REPORTES GLOBALES (admin)
    { 
      path: '/reportes', 
      icon: FaChartBar, 
      label: 'Reportes', 
      roles: ['admin']
    },
  ];

  // Filtramos el menú según el rol del usuario actual
  const menuItems = allMenuItems.filter(item => 
    user?.rol && item.roles.includes(user.rol)
  );

  return (
    <>
      {/* --- BOTÓN FLOTANTE MÓVIL (Abrir) --- */}
      <button
        onClick={onToggle}
        className={`
          fixed top-3 left-3 z-40 md:hidden
          bg-gray-900 text-white p-2.5 rounded-xl shadow-lg shadow-gray-900/20
          transition-all duration-300 active:scale-95 cursor-pointer
          ${isOpen ? 'opacity-0 pointer-events-none -translate-x-full' : 'opacity-100 translate-x-0'}
        `}
        aria-label="Abrir menú"
      >
        <FaBars className="text-xl" />
      </button>

      {/* --- OVERLAY OSCURO (Fondo) --- */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      />

      {/* --- SIDEBAR --- */}
      <aside 
        className={`
          bg-linear-to-b from-gray-900 to-gray-950 text-white shadow-2xl
          h-full flex flex-col shrink-0 transition-all duration-300 ease-in-out
          ${isOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full md:translate-x-0'}
          fixed md:relative z-50
        `}
      >
        {/* HEADER DEL SIDEBAR */}
        <div className={`flex items-center p-4 border-b border-gray-800 shrink-0 h-20 ${isOpen ? 'justify-between' : 'justify-center'}`}>
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${!isOpen ? 'w-0 opacity-0 hidden' : 'w-auto opacity-100'}`}>
            <div className="bg-blue-600 p-2 rounded-lg shrink-0">
              <span className="font-bold text-xl">IL</span>
            </div>
            <span className="font-bold text-lg whitespace-nowrap">InstaLar</span>
          </div>

          {/* Botón de CERRAR (SOLO MÓVIL) */}
          <button 
            onClick={onToggle}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <FaTimes className="text-xl" />
          </button>

          {/* Botón de COLAPSAR (SOLO DESKTOP) */}
          <button 
            onClick={onToggle}
            className={`
              hidden md:flex rounded-lg cursor-pointer transition-all duration-200
              flex-col items-center justify-center gap-1
              ${isOpen 
                ? 'p-2 hover:bg-gray-800 text-gray-400 hover:text-white' 
                : 'w-full h-full hover:bg-blue-500/10 hover:text-blue-400 group' 
              } 
            `}
          >
            {isOpen ? (
              <FaBars className="text-xl" />
            ) : (
              <>
                <img 
                  src="/logo.png" 
                  alt="Logo" 
                  className="w-8 h-8 object-contain mb-1 transition-transform duration-200 group-hover:scale-110" 
                />
                <FaBars className="text-lg transition-colors" />
              </>
            )}
          </button>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 overflow-y-auto py-4 overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => {
                      // Autocerrar en móvil al hacer click en un enlace
                      if (window.innerWidth < 768) {
                        onToggle();
                      }
                    }}
                    className={`
                      flex items-center gap-4 py-3 px-4 transition-all border-l-4
                      ${isActive 
                        ? 'bg-linear-to-r from-blue-600/20 to-transparent border-blue-500 text-blue-400' 
                        : 'border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'
                      }
                      ${!isOpen && 'justify-center px-2'}
                    `}
                    title={!isOpen ? item.label : ''}
                  >
                    <Icon className={`text-xl shrink-0 ${isActive ? 'text-blue-400' : ''}`} />
                    
                    <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
                      !isOpen ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER DEL SIDEBAR */}
        <div className="p-4 border-t border-gray-800 shrink-0">
          <div className={`text-xs text-center text-gray-500 transition-all duration-300 ${!isOpen && 'opacity-0'}`}>
            <p>Rol: <span className="text-blue-400 capitalize font-bold">{user?.rol}</span></p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;