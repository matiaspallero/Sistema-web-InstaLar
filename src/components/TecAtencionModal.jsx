import { useState } from 'react';
import QRCode from 'react-qr-code'; // 👈 Importamos la librería
import { 
  FaTimes, FaUser, FaMapMarkerAlt, FaPhone, FaTools, 
  FaCheckCircle, FaPlay, FaClock, FaCamera, FaQrcode, FaFileAlt 
} from 'react-icons/fa';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
//import { supabase } from '../config/supabase'; // Asegúrate de tener esto exportado

const TecAtencionModal = ({ servicio, onClose, onSuccess }) => {
  const { mostrarNotificacion } = useApp();
  const [activeTab, setActiveTab] = useState('detalles'); // detalles | evidencia | qr
  const [loading, setLoading] = useState(false);
  const [observaciones, setObservaciones] = useState(servicio.observaciones || '');
  
  // Estado para la foto
  const [uploading, setUploading] = useState(false);
  const [fotoUrl, setFotoUrl] = useState(servicio.evidencia_url || null);

  // --- FUNCIÓN SUBIR FOTO ---
  const handleFileUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      // Nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${servicio.id}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // 1. Subir a Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('evidencias') // Asegúrate de crear este bucket en Supabase
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Obtener URL pública
      const { data } = supabase.storage.from('evidencias').getPublicUrl(filePath);
      const publicUrl = data.publicUrl;

      // 3. Guardar URL en la base de datos (actualizamos el servicio al vuelo)
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

  const cambiarEstado = async (nuevoEstado) => {
    try {
      setLoading(true);
      if (nuevoEstado === 'completado') {
        if (observaciones.trim().length < 5) {
          mostrarNotificacion('Agrega una observación técnica antes de finalizar', 'warning');
          setLoading(false);
          return;
        }
        await api.servicios.update(servicio.id, { observaciones });
      }
      await api.servicios.updateEstado(servicio.id, nuevoEstado);
      mostrarNotificacion(`Servicio ${nuevoEstado}`, 'success');
      onSuccess();
      onClose();
    } catch (error) {
      mostrarNotificacion('Error al actualizar', 'error');
    } finally {
      setLoading(false);
    }
  };

  // URL ficticia para el QR (esto abriría la ficha del equipo en tu web)
  const qrData = `${window.location.origin}/equipos/ficha/${servicio.id}`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header Elegante */}
        <div className="bg-gray-900 text-white p-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FaTools className="text-blue-400" /> {servicio.tipo}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{servicio.equipo} - {servicio.marca}</p>
          </div>
          <button onClick={onClose} className="p-2 cursor-pointer hover:bg-white/10 rounded-full transition"><FaTimes /></button>
        </div>

        {/* Tabs de Navegación */}
        <div className="flex border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('detalles')}
                className={`flex-1 cursor-pointer py-3 font-semibold text-sm flex items-center justify-center gap-2 ${activeTab === 'detalles' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <FaFileAlt /> Detalles
            </button>
            <button 
                onClick={() => setActiveTab('evidencia')}
                className={`flex-1 cursor-pointer py-3 font-semibold text-sm flex items-center justify-center gap-2 ${activeTab === 'evidencia' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <FaCamera /> Evidencia
            </button>
            <button 
                onClick={() => setActiveTab('qr')}
                className={`flex-1 cursor-pointer py-3 font-semibold text-sm flex items-center justify-center gap-2 ${activeTab === 'qr' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                <FaQrcode /> Ficha QR
            </button>
        </div>

        {/* Contenido Scrollable */}
        <div className="p-6 overflow-y-auto flex-1">
            
            {/* --- TAB 1: DETALLES --- */}
            {activeTab === 'detalles' && (
                <div className="space-y-6">
                    {/* Tarjeta Cliente */}
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">
                                <FaUser />
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{servicio.clientes?.nombre}</p>
                                <p className="text-xs text-gray-500">{servicio.sedes?.nombre}</p>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <a href={`tel:${servicio.clientes?.telefono}`} className="flex-1 bg-white py-1.5 text-center text-xs font-bold text-gray-700 rounded border shadow-sm hover:bg-gray-50">
                                <FaPhone className="inline mr-1"/> Llamar
                            </a>
                            <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(servicio.sedes?.direccion)}`} target="_blank" rel="noreferrer" className="flex-1 bg-white py-1.5 text-center text-xs font-bold text-gray-700 rounded border shadow-sm hover:bg-gray-50">
                                <FaMapMarkerAlt className="inline mr-1"/> Mapa
                            </a>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div>
                        <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase">Problema Reportado</h3>
                        <p className="bg-gray-50 p-3 rounded-lg text-gray-700 text-sm border border-gray-200 italic">
                            "{servicio.descripcion}"
                        </p>
                    </div>

                    {/* Informe Técnico (Input) */}
                    {servicio.estado !== 'pendiente' && (
                        <div>
                            <h3 className="font-bold text-gray-800 mb-2 text-sm uppercase">Informe Técnico</h3>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
                                rows="4"
                                placeholder="Describe el trabajo realizado..."
                                value={observaciones}
                                onChange={(e) => setObservaciones(e.target.value)}
                                disabled={servicio.estado === 'completado'}
                            ></textarea>
                        </div>
                    )}
                </div>
            )}

            {/* --- TAB 2: EVIDENCIA --- */}
            {activeTab === 'evidencia' && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    {fotoUrl ? (
                        <div className="relative w-full rounded-xl overflow-hidden border border-gray-200 shadow-md group">
                            <img src={fotoUrl} alt="Evidencia" className="w-full h-64 object-cover" />
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <a href={fotoUrl} target="_blank" rel="noreferrer" className="text-white font-bold underline cursor-pointer">Ver pantalla completa</a>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                            <FaCamera className="text-4xl mb-2" />
                            <p className="text-sm">Sin foto adjunta</p>
                        </div>
                    )}

                    {servicio.estado !== 'completado' && (
                        <div className="w-full">
                            <label className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-xl font-bold cursor-pointer transition shadow-lg">
                                {uploading ? 'Subiendo...' : (fotoUrl ? 'Cambiar Foto' : 'Subir Foto del Trabajo')}
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    capture="environment" // Esto activa la cámara en móviles
                                    className="hidden" 
                                    onChange={handleFileUpload} 
                                    disabled={uploading}
                                />
                            </label>
                            <p className="text-xs text-center text-gray-400 mt-2">Permite al admin validar el trabajo.</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- TAB 3: CÓDIGO QR --- */}
            {activeTab === 'qr' && (
                <div className="flex flex-col items-center justify-center space-y-6 text-center pt-4">
                    <div className="bg-white p-4 rounded-xl border-4 border-gray-900 shadow-xl">
                        <QRCode value={qrData} size={200} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Ficha Técnica Digital</h3>
                        <p className="text-gray-500 text-sm mt-1">Escanea para ver historial del equipo</p>
                    </div>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-left w-full text-xs text-yellow-800">
                        <p><strong>Equipo:</strong> {servicio.equipo}</p>
                        <p><strong>ID Interno:</strong> {servicio.id.slice(0, 8)}...</p>
                        <p><strong>Fecha Instalación:</strong> {servicio.fecha}</p>
                    </div>
                    <button className="text-blue-600 font-bold hover:underline text-sm" onClick={() => window.print()}>
                        Imprimir Etiqueta
                    </button>
                </div>
            )}

        </div>

        {/* Footer Actions (Solo visible en pestaña Detalles para no estorbar) */}
        {activeTab === 'detalles' && (
            <div className="p-4 border-t border-gray-100 bg-gray-50">
                {servicio.estado === 'pendiente' && (
                    <button onClick={() => cambiarEstado('en-proceso')} disabled={loading} className="w-full cursor-pointer bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 flex justify-center gap-2 shadow-lg">
                        {loading ? '...' : <><FaPlay /> Iniciar Tarea</>}
                    </button>
                )}
                {servicio.estado === 'en-proceso' && (
                    <button onClick={() => cambiarEstado('completado')} disabled={loading} className="w-full cursor-pointer bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 flex justify-center gap-2 shadow-lg">
                        {loading ? 'Guardando...' : <><FaCheckCircle /> Finalizar Tarea</>}
                    </button>
                )}
                 {servicio.estado === 'completado' && (
                    <div className="text-center text-green-600 font-bold py-2 bg-green-50 rounded-lg border border-green-200">
                        ¡Trabajo Finalizado!
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default TecAtencionModal;