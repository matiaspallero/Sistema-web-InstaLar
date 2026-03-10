// MODAL PARA QUE EL TÉCNICO PUEDA VER LOS DETALLES DEL SERVICIO ASIGNADO, AGREGAR OBSERVACIONES TÉCNICAS, SUBIR FOTOS DE EVIDENCIA Y CAMBIAR EL ESTADO DEL SERVICIO
import { useState } from 'react';
import QRCode from 'react-qr-code';
import { 
  FaTimes, FaUser, FaMapMarkerAlt, FaPhone, FaTools, 
  FaCheckCircle, FaPlay, FaCamera, FaQrcode, FaFileAlt 
} from 'react-icons/fa';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
// import { supabase } from '../config/supabase';

const TecAtencionModal = ({ servicio, onClose, onSuccess }) => {
  const { mostrarNotificacion } = useApp();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('detalles');
  const [loading, setLoading] = useState(false);
  const [observaciones, setObservaciones] = useState(servicio.observaciones || '');
  const [uploading, setUploading] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(servicio.evidencia_url || null);

  // Estado para editar datos del equipo
  const [equipoData, setEquipoData] = useState({
    marca: servicio.equipos?.marca || '',
    modelo: servicio.equipos?.modelo || '',
    serie: servicio.equipos?.serie || '',
    frigorias: servicio.equipos?.frigorias || 9000,
    voltaje: '220',
    observaciones: servicio.equipos?.observaciones_tecnicas || ''
  });

  // --- FUNCIÓN SUBIR FOTO ---
  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${servicio.id}_${Date.now()}.${fileExt}`;
      const filePath = `evidencias/${fileName}`;

      // Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('evidencias')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtener URL pública
      const { data } = supabase.storage.from('evidencias').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // Guardar URL en la base de datos
      await api.servicios.update(servicio.id, { evidencia_url: publicUrl });
      
      setFotoUrl(publicUrl);
      mostrarNotificacion('Evidencia subida correctamente', 'success');

    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error al subir la foto', 'error');
    } finally {
      setUploading(false);
    }
  };

  // --- FUNCIÓN CAMBIAR ESTADO DEL SERVICIO ---
  const cambiarEstado = async (nuevoEstado) => {
    try {
      setLoading(true);

      // Validación: Si completa sin observaciones
      if (nuevoEstado === 'completado') {
        if (observaciones.trim().length < 5) {
          mostrarNotificacion('Agrega una observación técnica antes de finalizar', 'warning');
          setLoading(false);
          return;
        }
      }

      // Actualizar datos del equipo si existen
      if (servicio.equipo_id && (equipoData.marca || equipoData.serie)) {
        await api.equipos.update(servicio.equipo_id, {
          marca: equipoData.marca,
          modelo: equipoData.modelo,
          serie: equipoData.serie,
          frigorias: parseInt(equipoData.frigorias),
          observaciones_tecnicas: equipoData.observaciones
        });
      }

      // Actualizar servicio
      const updateData = { 
        observaciones: observaciones.trim()
      };
      await api.servicios.update(servicio.id, updateData);

      // Cambiar estado
      await api.servicios.updateEstado(servicio.id, nuevoEstado);
      
      mostrarNotificacion(`Servicio ${nuevoEstado} correctamente`, 'success');
      onSuccess();
      onClose();

    } catch (error) {
      console.error(error);
      mostrarNotificacion('Error al actualizar', 'error');
    } finally {
      setLoading(false);
    }
  };

  // URL para QR - apunta a la ficha técnica del equipo
  const qrData = servicio.equipo_id 
    ? `${window.location.origin}/equipos/${servicio.equipo_id}` 
    : `${window.location.origin}/servicios/${servicio.id}`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden my-8">
        
        {/* ========== HEADER ========== */}
        <div className="bg-linear-to-r from-gray-900 to-gray-800 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaTools className="text-blue-400" /> {servicio.tipo}
            </h2>
            <p className="text-gray-300 text-sm mt-2">
              📍 {servicio.sedes?.nombre} • {servicio.clientes?.nombre}
            </p>
            {servicio.equipos && (
              <p className="text-gray-400 text-xs mt-1">
                {servicio.equipos.marca} {servicio.equipos.modelo} • {servicio.equipos.frigorias}F
              </p>
            )}
          </div>
          <button onClick={onClose} className="p-2 cursor-pointer hover:bg-white/10 rounded-full transition">
            <FaTimes size={20} />
          </button>

          {servicio.equipo_id && (
            <a 
              href={`/equipos/${servicio.equipo_id}`}
              target="_blank"
              rel="noreferrer"
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm font-bold cursor-pointer transition"
            >
              📋 Ver Ficha Completa
            </a>
          )}

        </div>

        {/* ========== TABS ========== */}
        <div className="flex border-b border-gray-200 bg-white sticky top-0">
          <button 
            onClick={() => setActiveTab('detalles')}
            className={`flex-1 cursor-pointer py-3 font-semibold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'detalles' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaFileAlt /> Detalles
          </button>
          <button 
            onClick={() => setActiveTab('evidencia')}
            className={`flex-1 cursor-pointer py-3 font-semibold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'evidencia' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaCamera /> Evidencia
          </button>
          <button 
            onClick={() => setActiveTab('qr')}
            className={`flex-1 cursor-pointer py-3 font-semibold text-sm flex items-center justify-center gap-2 transition ${
              activeTab === 'qr' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaQrcode /> Ficha QR
          </button>
        </div>

        {/* ========== CONTENIDO SCROLLABLE ========== */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
          {/* --- TAB 1: DETALLES --- */}
          {activeTab === 'detalles' && (
            <div className="space-y-6">
              
              {/* Tarjeta Cliente */}
              <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    <FaUser />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{servicio.clientes?.nombre}</p>
                    <p className="text-xs text-gray-600">{servicio.sedes?.nombre}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a 
                    href={`tel:${servicio.clientes?.telefono}`} 
                    className="flex-1 bg-white py-1.5 text-center text-xs font-bold text-blue-600 rounded border shadow-sm hover:bg-blue-50 transition cursor-pointer"
                  >
                    <FaPhone className="inline mr-1" /> Llamar
                  </a>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(servicio.sedes?.direccion || '')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex-1 bg-white py-1.5 text-center text-xs font-bold text-green-600 rounded border shadow-sm hover:bg-green-50 transition cursor-pointer"
                  >
                    <FaMapMarkerAlt className="inline mr-1" /> Mapa
                  </a>
                </div>
              </div>

              {/* Descripción del Servicio */}
              <div>
                <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase">📋 Servicio Solicitado</h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700">{servicio.descripcion || servicio.tipo}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    📅 {new Date(servicio.fecha).toLocaleDateString('es-ES')} a las {servicio.hora}
                  </p>
                </div>
              </div>

              {/* Datos del Equipo (Solo lectura) */}
              {servicio.equipos && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-bold text-gray-800 mb-2 text-sm">🔧 Equipo</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-gray-600">Marca</p>
                      <p className="font-bold">{servicio.equipos.marca}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Modelo</p>
                      <p className="font-bold">{servicio.equipos.modelo}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-600">Serie</p>
                      <p className="font-mono font-bold text-xs">{servicio.equipos.serie}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Informe Técnico (Solo si no está pendiente) */}
              {servicio.estado !== 'pendiente' && (
                <div>
                  <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase">📝 Informe Técnico</h3>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition resize-none"
                    rows="4"
                    placeholder="Describe el trabajo realizado, problemas encontrados, reparaciones..."
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    disabled={servicio.estado === 'completado'}
                  />
                  {servicio.estado === 'completado' && (
                    <p className="text-xs text-gray-500 mt-1">✓ Este servicio ya está finalizado</p>
                  )}
                </div>
              )}

              {/* NUEVA SECCIÓN: EDITAR DATOS DEL EQUIPO */}
              {servicio.estado !== 'completado' && servicio.equipo_id && (
                <div className="border-t pt-6">
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FaTools /> Actualizar Ficha del Equipo
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">Marca</label>
                        <input 
                          type="text" 
                          placeholder="LG, Daikin, Fujitsu..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          value={equipoData.marca}
                          onChange={(e) => setEquipoData({...equipoData, marca: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">Modelo</label>
                        <input 
                          type="text" 
                          placeholder="LS-H1235STI"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          value={equipoData.modelo}
                          onChange={(e) => setEquipoData({...equipoData, modelo: e.target.value})}
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="text-xs font-bold text-gray-600 block mb-1">Número de Serie *</label>
                        <input 
                          type="text" 
                          placeholder="ABC123456789"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          value={equipoData.serie}
                          onChange={(e) => setEquipoData({...equipoData, serie: e.target.value})}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-gray-600 block mb-1">Frigorías</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                          value={equipoData.frigorias}
                          onChange={(e) => setEquipoData({...equipoData, frigorias: parseInt(e.target.value)})}
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
                        <label className="text-xs font-bold text-gray-600 block mb-1">Voltaje</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white cursor-pointer"
                          value={equipoData.voltaje || '220'}
                          onChange={(e) => setEquipoData({...equipoData, voltaje: e.target.value})}
                        >
                          <option value="110">110V</option>
                          <option value="220">220V</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Observaciones Técnicas</label>
                      <textarea 
                        placeholder="Posición de instalación, estado físico, reparaciones realizadas..."
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                        value={equipoData.observaciones || ''}
                        onChange={(e) => setEquipoData({...equipoData, observaciones: e.target.value})}
                      />
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-700">
                      💡 Estos datos se guardarán en la ficha técnica del equipo para futuros servicios
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* --- TAB 2: EVIDENCIA --- */}
          {activeTab === 'evidencia' && (
            <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
              {fotoUrl ? (
                <div className="w-full rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                  <img src={fotoUrl} alt="Evidencia" className="w-full h-80 object-cover" />
                  <div className="p-3 bg-gray-50 flex gap-2">
                    <a 
                      href={fotoUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 text-center text-sm text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Ver en pantalla completa
                    </a>
                  </div>
                </div>
              ) : (
                <div className="w-full h-80 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                  <FaCamera className="text-5xl mb-3" />
                  <p className="text-sm font-semibold">Sin foto adjunta</p>
                  <p className="text-xs text-gray-400 mt-1">Sube una evidencia del trabajo realizado</p>
                </div>
              )}

              {servicio.estado !== 'completado' && (
                <div className="w-full">
                  <label className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-bold cursor-pointer transition shadow-lg">
                    {uploading ? '📤 Subiendo...' : (fotoUrl ? '🔄 Cambiar Foto' : '📸 Subir Foto del Trabajo')}
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment"
                      className="hidden" 
                      onChange={handleFileUpload} 
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-xs text-center text-gray-500 mt-2">
                    La foto del trabajo ayuda al administrador a validar el servicio completado
                  </p>
                </div>
              )}

              {servicio.estado === 'completado' && (
                <div className="w-full bg-green-50 p-3 rounded-lg border border-green-200 text-center text-green-700 text-sm font-semibold">
                  ✓ Este servicio ya está finalizado
                </div>
              )}
            </div>
          )}

          {/* --- TAB 3: CÓDIGO QR --- */}
          {activeTab === 'qr' && (
            <div className="flex flex-col items-center justify-center space-y-6 py-6">
              <div className="bg-white p-6 rounded-xl border-4 border-gray-200 shadow-xl">
                <QRCode value={qrData} size={200} level="H" />
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-800">Ficha Técnica Digital</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {servicio.equipo_id ? 'Escanea para ver el historial del equipo' : 'Escanea para ver detalles del servicio'}
                </p>
              </div>

              {servicio.equipos && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 w-full text-sm text-yellow-800 space-y-1">
                  <p><strong>🔧 Equipo:</strong> {servicio.equipos.marca} {servicio.equipos.modelo}</p>
                  <p><strong>❄️ Frigorías:</strong> {servicio.equipos.frigorias} F</p>
                  <p><strong>🏷️ Serie:</strong> <span className="font-mono text-xs">{servicio.equipos.serie}</span></p>
                  <p><strong>📅 Servicios:</strong> Historial disponible</p>
                </div>
              )}

              <button 
                onClick={() => window.print()}
                className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-bold text-sm transition cursor-pointer"
              >
                🖨️ Imprimir Etiqueta QR
              </button>
            </div>
          )}
        </div>

        {/* ========== FOOTER - BOTONES ACCIÓN ========== */}
        {activeTab === 'detalles' && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            {servicio.estado === 'pendiente' && (
              <button 
                onClick={() => cambiarEstado('en-proceso')} 
                disabled={loading}
                className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex justify-center gap-2 shadow-lg transition disabled:opacity-50"
              >
                <FaPlay /> {loading ? 'Iniciando...' : 'Iniciar Tarea'}
              </button>
            )}

            {servicio.estado === 'en-proceso' && (
              <button 
                onClick={() => cambiarEstado('completado')} 
                disabled={loading || observaciones.trim().length < 5}
                className="w-full cursor-pointer bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold flex justify-center gap-2 shadow-lg transition disabled:opacity-50"
              >
                <FaCheckCircle /> {loading ? 'Guardando...' : 'Finalizar Tarea'}
              </button>
            )}

            {servicio.estado === 'completado' && (
              <div className="text-center bg-green-100 text-green-700 font-bold py-3 rounded-lg border border-green-300">
                ✅ ¡Trabajo Finalizado!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TecAtencionModal;