import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaTools, FaSave, FaTimes } from 'react-icons/fa';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const EditarEquipo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mostrarNotificacion } = useApp();

  const [equipo, setEquipo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    tipo: '',
    marca: '',
    modelo: '',
    serie: '',
    frigorias: 9000,
    voltaje: '220',
    estado: 'activo',
    observaciones_tecnicas: ''
  });

  useEffect(() => {
    cargarEquipo();
  }, [id]);

  const cargarEquipo = async () => {
    try {
      setLoading(true);
      const res = await api.equipos.getById(id);
      const equipoData = Array.isArray(res) ? res[0] : res.data;
      setEquipo(equipoData);
      setFormData({
        tipo: equipoData.tipo || '',
        marca: equipoData.marca || '',
        modelo: equipoData.modelo || '',
        serie: equipoData.serie || '',
        frigorias: equipoData.frigorias || 9000,
        voltaje: equipoData.voltaje || '220',
        estado: equipoData.estado || 'activo',
        observaciones: equipoData.observaciones || ''
      });
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error cargando equipo', 'error');
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'frigorias' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.serie.trim()) {
      mostrarNotificacion('El número de serie es obligatorio', 'warning');
      return;
    }

    try {
      setSaving(true);
      await api.equipos.update(id, formData);
      mostrarNotificacion('Equipo actualizado correctamente', 'success');
      navigate(`/equipos/${id}`);
    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error al guardar cambios', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Cargando equipo...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate(`/equipos/${id}`)}
            className="flex items-center gap-2 mb-4 hover:bg-white/20 px-3 py-1 rounded cursor-pointer transition"
          >
            <FaArrowLeft /> Volver
          </button>
          
          <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
            <FaTools /> Editar Equipo
          </h1>
          <p className="text-blue-100">
            {equipo?.marca} {equipo?.modelo}
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="max-w-3xl mx-auto py-8 px-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
          
          {/* Datos Técnicos */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FaTools className="text-blue-600" /> Especificaciones Técnicas
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Equipo</label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                >
                  <option value="">Seleccionar...</option>
                  <option value="split">Split</option>
                  <option value="ventana">Ventana</option>
                  <option value="central">Central</option>
                  <option value="portatil">Portátil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Marca</label>
                <input
                  type="text"
                  name="marca"
                  value={formData.marca}
                  onChange={handleChange}
                  placeholder="LG, Daikin, Fujitsu..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Modelo</label>
                <input
                  type="text"
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  placeholder="LS-H1235STI..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Número de Serie *</label>
                <input
                  type="text"
                  name="serie"
                  value={formData.serie}
                  onChange={handleChange}
                  placeholder="ABC1234567890"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Frigorías</label>
                <select
                  name="frigorias"
                  value={formData.frigorias}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                >
                  <option value="2250">2.250 F</option>
                  <option value="3000">3.000 F</option>
                  <option value="3500">3.500 F</option>
                  <option value="4500">4.500 F</option>
                  <option value="5000">5.000 F</option>
                  <option value="6000">6.000 F</option>
                  <option value="7500">7.500 F</option>
                  <option value="9000">9.000 F</option>
                  <option value="12000">12.000 F</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Voltaje</label>
                <select
                  name="voltaje"
                  value={formData.voltaje}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                >
                  <option value="110">110V</option>
                  <option value="220">220V</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                  <option value="descartado">Descartado</option>
                </select>
              </div>
            </div>
          </section>

          {/* Observaciones */}
          <section>
            <label className="block text-sm font-bold text-gray-700 mb-2">Observaciones Técnicas</label>
            <textarea
              name="observaciones_tecnicas"
              value={formData.observaciones_tecnicas}
              onChange={handleChange}
              placeholder="Posición de instalación, características especiales, reparaciones realizadas..."
              rows="5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </section>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(`/equipos/${id}`)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition cursor-pointer flex items-center justify-center gap-2"
            >
              <FaTimes /> Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <FaSave /> {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditarEquipo;