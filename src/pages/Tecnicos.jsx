import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import Loading from '../components/Loading';
import TecnicoCard from '../components/TecnicoCard';
import {
  FaUserPlus,
  FaSearch,
  FaTimes,
  FaSave,
  FaLock,
  FaEnvelope,
} from 'react-icons/fa';

const Tecnicos = () => {
  const { mostrarNotificacion } = useApp();
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  // Modales
  const [showModal, setShowModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    especialidad: '',
    estado: 'disponible',
    password: '',
  });
  const [tecnicoIdEditar, setTecnicoIdEditar] = useState(null);

  // --- CARGAR DATOS ---
  const cargarTecnicos = async () => {
    try {
      setLoading(true);
      // Lee de tu tabla 'tecnicos'
      const res = await api.tecnicos.getAll();
      const data = Array.isArray(res) ? res : res.data || [];
      setTecnicos(data);
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error cargando técnicos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarTecnicos();
  }, []);

  // --- GUARDAR (DOBLE ACCIÓN) ---
  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      if (modoEdicion) {
        // ACTUALIZAR (Solo tabla visual)
        const { password, email, ...datosTabla } = formData;
        await api.tecnicos.update(tecnicoIdEditar, datosTabla);
        mostrarNotificacion('Técnico actualizado', 'success');
      } else {
        // CREAR NUEVO (Magia Doble)
        if (!formData.email || !formData.password) {
          mostrarNotificacion('Email y contraseña obligatorios', 'warning');
          return;
        }

        // 1. Crear Usuario en Auth (Para que pueda loguearse)
        const resAuth = await api.auth.register({
          nombre: formData.nombre,
          apellido: formData.apellido,
          telefono: formData.telefono,
          email: formData.email,
          password: formData.password,
          rol: 'tecnico',
        });

        if (!resAuth.success) {
          throw new Error(
            resAuth.message || 'Error al crear el usuario de acceso',
          );
        }

        // 2. Crear Registro en Tabla 'tecnicos' (Para que el Admin lo vea)
        // OJO: Quitamos la password antes de guardar en la tabla pública
        const { password, ...datosParaTabla } = formData;

        await api.tecnicos.create({
          ...datosParaTabla,
          // Guardamos el ID del usuario generado para vincularlos (opcional pero recomendado)
          // usuario_id: resAuth.user?.id
        });

        mostrarNotificacion(
          'Técnico creado y habilitado para login',
          'success',
        );
      }

      setShowModal(false);
      cargarTecnicos(); // Recargar la lista
    } catch (error) {
      console.error(error);
      // Si el error es "User already registered", es porque ya existe en Auth
      mostrarNotificacion(error.message || 'Error al procesar', 'error');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Eliminar técnico de la lista?')) {
      try {
        await api.tecnicos.delete(id);
        mostrarNotificacion('Técnico eliminado', 'success');
        cargarTecnicos();
      } catch (error) {
        mostrarNotificacion('No se pudo eliminar', 'error');
      }
    }
  };

  // Helpers de UI
  const abrirModalCrear = () => {
    setFormData({
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      especialidad: '',
      estado: 'disponible',
      password: '',
    });
    setTecnicoIdEditar(null);
    setModoEdicion(false);
    setShowModal(true);
  };

  const abrirModalEditar = (tec) => {
    setFormData({
      nombre: tec.nombre,
      apellido: tec.apellido || '',
      email: tec.email || '',
      telefono: tec.telefono,
      especialidad: tec.especialidad,
      estado: tec.estado || 'disponible',
      password: '',
    });
    setTecnicoIdEditar(tec.id);
    setModoEdicion(true);
    setShowModal(true);
  };

  const tecnicosFiltrados = tecnicos.filter(
    (t) =>
      t.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      t.especialidad.toLowerCase().includes(busqueda.toLowerCase()),
  );

  if (loading) return <Loading mensaje="Cargando equipo..." />;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaUserPlus className="text-blue-600" /> Equipo Técnico
          </h1>
          <p className="text-gray-500 text-sm">
            Gestiona a tu personal y sus accesos
          </p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative w-full md:w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <button
            onClick={abrirModalCrear}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-md cursor-pointer"
          >
            <FaUserPlus /> Nuevo Técnico
          </button>
        </div>
      </div>

      {tecnicosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tecnicosFiltrados.map((tec) => (
            <TecnicoCard
              key={tec.id}
              tecnico={tec}
              onEdit={() => abrirModalEditar(tec)}
              onDelete={() => handleEliminar(tec.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">
            No hay técnicos registrados en la lista.
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
              <h2 className="font-bold text-lg">
                {modoEdicion ? 'Editar Técnico' : 'Registrar Nuevo Técnico'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white cursor-pointer"
              >
                <FaTimes size={18}/>
              </button>
            </div>
            <form
              onSubmit={handleGuardar}
              className="p-6 space-y-4 overflow-y-auto"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.nombre}
                    placeholder='Nombre'
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Apellido
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.apellido}
                    placeholder='Apellido'
                    onChange={(e) =>
                      setFormData({ ...formData, apellido: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Especialidad
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="Ej: Aire"
                    value={formData.especialidad}
                    onChange={(e) =>
                      setFormData({ ...formData, especialidad: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-lg"
                    value={formData.telefono}
                    placeholder='Teléfono'
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Email (Login)
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    required
                    disabled={modoEdicion}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg ${modoEdicion ? 'bg-gray-100' : ''}`}
                    value={formData.email}
                    placeholder='Email'
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>
              {!modoEdicion && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <label className="text-sm font-bold text-yellow-800 mb-1 flex items-center gap-2">
                    <FaLock /> Contraseña de Acceso
                  </label>
                  <input
                    type="password"
                    required={!modoEdicion}
                    className="w-full px-3 py-2 border border-yellow-300 rounded-lg bg-white"
                    placeholder="Contraseña inicial"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border rounded-lg hover:bg-gray-50 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <FaSave /> {modoEdicion ? 'Guardar Cambios' : 'Crear Técnico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tecnicos;
