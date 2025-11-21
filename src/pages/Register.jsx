import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, ROLES } from '../context/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaBuilding, FaEye, FaEyeSlash, FaSpinner, FaUserShield, FaTools, FaUserTie, FaArrowLeft, FaSnowflake } from 'react-icons/fa';

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    rol: ROLES.CLIENTE,
    empresa: '',
    especialidad: '',
    direccion: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const rolesInfo = [
    {
      value: ROLES.CLIENTE,
      label: 'Cliente',
      icon: FaUserTie,
      description: 'Solicita y gestiona servicios de mantenimiento',
      color: 'blue',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700'
    },
    {
      value: ROLES.TECNICO,
      label: 'Técnico',
      icon: FaTools,
      description: 'Realiza servicios de mantenimiento',
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      requiresApproval: true
    }
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    const phoneRegex = /^9\d{8}$/;
    if (!formData.telefono) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!phoneRegex.test(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido (formato: 9XXXXXXXX)';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Debe contener mayúsculas, minúsculas y números';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (formData.rol === ROLES.CLIENTE && !formData.empresa.trim()) {
      newErrors.empresa = 'El nombre de la empresa es requerido';
    }

    if (formData.rol === ROLES.TECNICO && !formData.especialidad.trim()) {
      newErrors.especialidad = 'La especialidad es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const result = await register({
      nombre: formData.nombre.trim(),
      apellido: formData.apellido.trim(),
      email: formData.email.toLowerCase().trim(),
      telefono: formData.telefono.trim(),
      password: formData.password,
      rol: formData.rol,
      empresa: formData.empresa.trim(),
      especialidad: formData.especialidad.trim(),
      direccion: formData.direccion.trim(),
      estado: formData.rol === ROLES.CLIENTE ? 'activo' : 'pendiente'
    });

    if (result.success) {
      if (formData.rol === ROLES.TECNICO) {
        alert('Registro exitoso. Tu cuenta será revisada por un administrador.');
        navigate('/login');
      } else {
        navigate('/dashboard');
      }
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-500 via-blue-600 to-purple-700 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/login" className="inline-flex items-center text-white hover:text-gray-200 mb-4 transition">
            <FaArrowLeft className="mr-2" />
            Volver al login
          </Link>
          <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-full ml-4 mb-4 shadow-lg">
            <FaSnowflake className="text-4xl text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-blue-100">Únete a InstaLar y gestiona tus servicios</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Selección de Rol */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Selecciona tu tipo de cuenta</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rolesInfo.map((roleInfo) => {
                const Icon = roleInfo.icon;
                const isSelected = formData.rol === roleInfo.value;
                
                return (
                  <button
                    key={roleInfo.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rol: roleInfo.value }))}
                    className={`
                      relative p-6 rounded-xl border-2 transition-all text-left transform hover:scale-105
                      ${isSelected 
                        ? `${roleInfo.borderColor} ${roleInfo.bgColor} shadow-lg` 
                        : 'border-gray-200 hover:border-gray-300 bg-white'}
                    `}
                  >
                    {roleInfo.requiresApproval && (
                      <span className="absolute top-2 right-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded font-medium">
                        Requiere aprobación
                      </span>
                    )}
                    <Icon className={`text-3xl mb-3 ${isSelected ? roleInfo.textColor : 'text-gray-400'}`} />
                    <h4 className={`font-semibold mb-1 ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                      {roleInfo.label}
                    </h4>
                    <p className="text-sm text-gray-600">{roleInfo.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg animate-shake">
                {serverError}
              </div>
            )}

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.nombre ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Juan"
                  />
                </div>
                {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Apellido *</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.apellido ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Pérez"
                  />
                </div>
                {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
              </div>
            </div>

            {/* Email y Teléfono */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="juan@email.com"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono *</label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.telefono ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="987654321"
                    maxLength="9"
                  />
                </div>
                {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
              </div>
            </div>

            {/* Campos específicos por rol */}
            {formData.rol === ROLES.CLIENTE && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Empresa *</label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.empresa ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Mi Empresa S.A.C."
                  />
                </div>
                {errors.empresa && <p className="text-red-500 text-xs mt-1">{errors.empresa}</p>}
              </div>
            )}

            {formData.rol === ROLES.TECNICO && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad *</label>
                <select
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                    errors.especialidad ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona una especialidad</option>
                  <option value="split">Aires Split</option>
                  <option value="central">Aires Centrales</option>
                  <option value="industrial">Aires Industriales</option>
                  <option value="ventilacion">Sistemas de Ventilación</option>
                  <option value="general">Mantenimiento General</option>
                </select>
                {errors.especialidad && <p className="text-red-500 text-xs mt-1">{errors.especialidad}</p>}
              </div>
            )}

            {/* Contraseñas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña *</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="text-gray-400" /> : <FaEye className="text-gray-400" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Términos */}
            <div className="flex items-start">
              <input type="checkbox" required className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label className="ml-2 text-sm text-gray-700">
                Acepto los términos y condiciones y la política de privacidad
              </label>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creando cuenta...
                </>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </form>

          {/* Link a Login */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold transition">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;