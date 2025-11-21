import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

// Definición de roles y permisos
export const ROLES = {
  ADMIN: 'admin',
  TECNICO: 'tecnico',
  CLIENTE: 'cliente'
};

export const PERMISSIONS = {
  // Dashboard
  'dashboard.view': [ROLES.ADMIN, ROLES.TECNICO],
  
  // Clientes
  'clientes.view': [ROLES.ADMIN, ROLES.TECNICO],
  'clientes.create': [ROLES.ADMIN],
  'clientes.edit': [ROLES.ADMIN],
  'clientes.delete': [ROLES.ADMIN],
  
  // Servicios
  'servicios.view': [ROLES.ADMIN, ROLES.TECNICO, ROLES.CLIENTE],
  'servicios.create': [ROLES.ADMIN],
  'servicios.edit': [ROLES.ADMIN, ROLES.TECNICO],
  'servicios.delete': [ROLES.ADMIN],
  'servicios.asignar': [ROLES.ADMIN],
  
  // Técnicos
  'tecnicos.view': [ROLES.ADMIN],
  'tecnicos.create': [ROLES.ADMIN],
  'tecnicos.edit': [ROLES.ADMIN],
  'tecnicos.delete': [ROLES.ADMIN],
  
  // Reportes
  'reportes.view': [ROLES.ADMIN],
  'reportes.advanced': [ROLES.ADMIN],
  
  // Sedes
  'sedes.view': [ROLES.ADMIN, ROLES.TECNICO],
  'sedes.create': [ROLES.ADMIN],
  'sedes.edit': [ROLES.ADMIN],
  'sedes.delete': [ROLES.ADMIN],
  
  // Calendario
  'calendario.view': [ROLES.ADMIN, ROLES.TECNICO],
  'calendario.edit': [ROLES.ADMIN],
  
  // Configuración
  'configuracion.view': [ROLES.ADMIN],
  'configuracion.edit': [ROLES.ADMIN]
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay sesión al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          
          // Verificar si el token sigue siendo válido
          const response = await api.auth.verifyToken(token);
          
          if (response.valid) {
            setUser(parsedUser);
          } else {
            // Token inválido, limpiar
            logout();
          }
        } catch (error) {
          console.error('Error al verificar token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.auth.login({ email, password });
      
      if (!response.success) {
        throw new Error(response.message || 'Error al iniciar sesión');
      }

      const { user: userData, token } = response;

      // Validar que el usuario tenga un rol válido
      if (!Object.values(ROLES).includes(userData.rol)) {
        throw new Error('Rol de usuario no válido');
      }

      // Guardar token y usuario
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setLoading(false);
      
      return { success: true, user: userData };
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await api.auth.register(userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Error al registrar usuario');
      }

      // Login automático después del registro
      if (response.token) {
        const { user: newUser, token } = response;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      }

      setLoading(false);
      return { success: true, message: 'Usuario registrado exitosamente' };
    } catch (error) {
      setError(error.message);
      setLoading(false);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setError(null);
  };

  const updateUser = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (permission) => {
    if (!user) return false;
    const allowedRoles = PERMISSIONS[permission] || [];
    return allowedRoles.includes(user.rol);
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    if (!user) return false;
    return user.rol === role;
  };

  // Verificar múltiples roles (para allowedRoles)
  const hasAnyRole = (roles) => {
    if (!user || !roles || roles.length === 0) return false;
    return roles.includes(user.rol);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user,
    isAdmin: user?.rol === ROLES.ADMIN,
    isTecnico: user?.rol === ROLES.TECNICO,
    isCliente: user?.rol === ROLES.CLIENTE,
    loading,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};