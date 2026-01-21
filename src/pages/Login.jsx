import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, FaSnowflake } from 'react-icons/fa';

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, setError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Obtener la ruta desde donde vino (si fue redirigido)
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar errores al escribir
    setLocalError('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (!formData.email || !formData.password) {
      setLocalError('Por favor, completa todos los campos');
      return;
    }

    if (!formData.email.includes('@')) {
      setLocalError('Por favor, ingresa un email válido');
      return;
    }

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Redirigir según el rol del usuario
      const userRole = result.user.rol;
      
      switch (userRole) {
        case ROLES.ADMIN:
          navigate(from === '/login' ? '/dashboard' : from);
          break;
        case ROLES.TECNICO:
          navigate('/dashboard'); // Técnicos van al dashboard general
          break;
        case ROLES.CLIENTE:
          navigate('/clienteDashboard'); // Los clientes ven sus servicios
          break;
        default:
          navigate('/dashboard');
      }
    } else {
      setLocalError(result.message);
    }
  };

  // Función para login rápido (solo desarrollo)
  const quickLogin = async (role) => {
    const credentials = {
      admin: { email: 'admin@instalar.com', password: 'Admin' },
      tecnico: { email: 'tecnico@instalar.com', password: 'tecnico123' },
      cliente: { email: 'cliente@instalar.com', password: 'cliente123' }
    };

    setFormData(credentials[role]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-blue-500 via-blue-600 to-purple-700 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
            <FaSnowflake className="text-4xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">InstaLar</h1>
          <p className="text-gray-600">Sistema de Gestión de Mantenimiento A/C</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mostrar errores */}
          {(error || localError) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start animate-shake">
              <svg className="w-5 h-5 mr-2 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">{error || localError}</span>
            </div>
          )}

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="tu@email.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-400 hover:text-gray-600 transition" />
                ) : (
                  <FaEye className="text-gray-400 hover:text-gray-600 transition" />
                )}
              </button>
            </div>
          </div>

          {/* Recordar y Olvidé contraseña */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">Recordarme</span>
            </label>
            <Link to="/recuperar-password" className="text-blue-600 hover:text-blue-700 font-medium transition">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-linear-to-r cursor-pointer from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        {/* Links adicionales */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="text-blue-600 cursor-pointer hover:text-blue-700 font-semibold transition">
              Regístrate aquí
            </Link>
          </p>
        </div>

        {/* Demo credentials (SOLO DESARROLLO - remover en producción) */}
        {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 font-semibold mb-3">🔧 Acceso rápido (desarrollo):</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => quickLogin('admin')}
                className="text-xs bg-purple-100 text-purple-700 px-3 py-2 rounded hover:bg-purple-200 transition font-medium"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => quickLogin('tecnico')}
                className="text-xs bg-green-100 text-green-700 px-3 py-2 rounded hover:bg-green-200 transition font-medium"
              >
                Técnico
              </button>
              <button
                type="button"
                onClick={() => quickLogin('cliente')}
                className="text-xs bg-blue-100 text-blue-700 px-3 py-2 rounded hover:bg-blue-200 transition font-medium"
              >
                Cliente
              </button>
            </div>
            <div className="mt-3 space-y-1 text-xs text-gray-600">
              <p><strong>Admin:</strong> admin@instalar.com / Admin</p>
              <p><strong>Técnico:</strong> tecnico@instalar.com / tecnico123</p>
              <p><strong>Cliente:</strong> cliente@instalar.com / cliente123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;