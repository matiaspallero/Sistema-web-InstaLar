import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaPhone, FaMapMarkerAlt, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { api } from '../services/api'; // Importamos API para guardar en tabla clientes

const Register = () => {
  const { register } = useAuth(); // Esta función crea el usuario de Login
  const { mostrarNotificacion } = useApp();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    empresa: '',
    telefono: '',
    direccion: '',
    rol: 'cliente' // Siempre fijo
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ---------------------------------------------------------
      // PASO 1: REGISTRO EN AUTH
      // ---------------------------------------------------------
      const resAuth = await register(formData);

      // 🔍 DEBUG: Mira la consola del navegador (F12) si esto falla de nuevo
      console.log("📦 RESPUESTA DEL BACKEND:", resAuth);

      if (!resAuth.success) {
        throw new Error(resAuth.message || 'Error al crear la cuenta');
      }

      // 🛡️ EXTRACCIÓN SEGURA DEL ID
      // Buscamos el usuario en 'resAuth.user' O en 'resAuth.data.user'
      const usuarioCreado = resAuth.user || resAuth.data?.user || resAuth.data?.session?.user;
      const usuarioId = usuarioCreado?.id;

      // Si después de buscar en todos lados sigue siendo null, lanzamos error manual
      if (!usuarioId) {
        console.error("❌ ESTRUCTURA RECIBIDA INCORRECTA:", resAuth);
        throw new Error("El usuario se creó, pero no pudimos recuperar su ID para crear el perfil.");
      }

      console.log("✅ ID RECUPERADO:", usuarioId);

      // ---------------------------------------------------------
      // PASO 2: CREAR PERFIL DE CLIENTE
      // ---------------------------------------------------------
      await api.clientes.create({
        nombre: formData.nombre,
        empresa: formData.empresa || formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        direccion: formData.direccion,
        usuario_id: usuarioId // <--- Aquí usamos el ID seguro
      });

      mostrarNotificacion('¡Cuenta y perfil creados con éxito!', 'success');
      navigate('/clienteDashboard');

    } catch (error) {
      console.error(error);
      mostrarNotificacion(error.message || 'Error durante el registro', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-radial from-blue-500 via-blue-600 to-purple-700 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row animate-fade-in">
        
        {/* Lado Izquierdo (Banner) */}
        <div className="md:w-1/2 bg-blue-900 p-8 text-white flex flex-col justify-center items-center text-center relative">
          <div className="absolute inset-0 bg-linear-to-br from-blue-600 to-blue-900 opacity-90"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-4">Portal de Clientes</h2>
            <p className="text-blue-100 mb-6">
              Gestiona tus servicios de mantenimiento de forma rápida y transparente.
            </p>
            <p className="text-sm opacity-80">¿Ya tienes cuenta?</p>
            <Link to="/login" className="mt-2 inline-block bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg font-bold transition backdrop-blur-sm">
              Iniciar Sesión
            </Link>
          </div>
        </div>

        {/* Lado Derecho (Formulario) */}
        <div className="md:w-1/2 p-8 md:p-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Empresa</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <FaUser className="absolute top-3.5 left-3 text-gray-400" />
                <input 
                  type="text" name="nombre" placeholder="Nombre de Contacto" required 
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <FaBuilding className="absolute top-3.5 left-3 text-gray-400" />
                <input 
                  type="text" name="empresa" placeholder="Nombre Empresa" required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="relative">
              <FaEnvelope className="absolute top-3.5 left-3 text-gray-400" />
              <input 
                type="email" name="email" placeholder="Correo Corporativo" required 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <FaPhone className="absolute top-3.5 left-3 text-gray-400" />
              <input 
                type="tel" name="telefono" placeholder="Teléfono" required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <FaMapMarkerAlt className="absolute top-3.5 left-3 text-gray-400" />
              <input 
                type="text" name="direccion" placeholder="Dirección Principal" required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <FaLock className="absolute top-3.5 left-3 text-gray-400" />
              <input 
                type="password" name="password" placeholder="Contraseña" required 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg mt-2 flex items-center justify-center gap-2">
              {loading ? <FaSpinner className="animate-spin" /> : 'Crear Cuenta'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;