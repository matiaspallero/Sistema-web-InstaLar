import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wind,
  Shield,
  Clock,
  Menu,
  X,
  PlayCircle,
  Smartphone,
  CheckCircle,
  ArrowRight,
  MapPin,
  User,
  Activity,
  Facebook,
  Instagram,
  Send,
  Mail
} from "lucide-react";

const añoConcurriente = new Date().getFullYear();

const Inicio = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);


  const servicios = [
    {
      icono: <Wind className="w-12 h-12" />,
      titulo: "Mantenimiento Preventivo",
      descripcion: "Inspecciones periódicas para garantizar el óptimo funcionamiento y aire limpio.",
    },
    {
      icono: <Shield className="w-12 h-12" />,
      titulo: "Reparación Certificada",
      descripcion: "Diagnóstico preciso y repuestos originales con garantía de servicio.",
    },
    {
      icono: <Clock className="w-12 h-12" />,
      titulo: "Urgencias 24/7",
      descripcion: "Respuesta inmediata para equipos críticos en servidores o comercios.",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      
      {/* --- NAVBAR --- */}
      <nav className="fixed w-full bg-white/90 backdrop-blur-md shadow-sm z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
                <img 
                  src="/INSTALAR-FONDO.png" 
                  alt="LOGO INSTALAR" 
                  // h-12 le da un alto perfecto de navbar, w-auto mantiene la proporción
                  // mix-blend-multiply hace que el fondo blanco del JPG "desaparezca"
                  className="h-10 md:h-12 w-auto object-contain mix-blend-multiply shadow-2xl shadow-blue-300 hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="text-2xl font-bold text-gray-800 tracking-tight shadow-2xl shadow-blue-300">
                InstaLar
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8 font-medium text-md">
              <a href="#inicio" className="text-gray-600 hover:text-blue-600 transition">Inicio</a>
              <a href="#servicios" className="text-gray-600 hover:text-blue-600 transition">Servicios</a>
              <a href="#tecnologia" className="text-gray-600 hover:text-blue-600 transition">Tecnología</a>
              <a href="#cotizar" className="text-gray-600 hover:text-blue-600 transition">Cotizar</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-gray-700 font-bold hover:text-blue-600 transition text-sm">
                Soy Cliente
              </Link>
              <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:scale-105 transition-all text-sm flex items-center gap-2">
                Empezar Ahora <ArrowRight size={16} />
              </Link>
            </div>

            <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuAbierto(!menuAbierto)}>
              {menuAbierto ? <X /> : <Menu />}
            </button>
            
          </div>
        </div>

        {/* --- MENÚ DESPLEGABLE MÓVIL --- */}
        {menuAbierto && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-xl py-4 px-6 flex flex-col gap-4 animate-fade-in z-50">
            <a href="#inicio" onClick={() => setMenuAbierto(false)} className="text-gray-700 font-medium hover:text-blue-600 py-2 border-b border-gray-50">Inicio</a>
            <a href="#servicios" onClick={() => setMenuAbierto(false)} className="text-gray-700 font-medium hover:text-blue-600 py-2 border-b border-gray-50">Servicios</a>
            <a href="#tecnologia" onClick={() => setMenuAbierto(false)} className="text-gray-700 font-medium hover:text-blue-600 py-2 border-b border-gray-50">Tecnología</a>
            <a href="#cotizar" onClick={() => setMenuAbierto(false)} className="text-gray-700 font-medium hover:text-blue-600 py-2">Cotizar</a>
            
            <div className="border-t border-gray-100 pt-4 flex flex-col gap-3 mt-2">
              <Link to="/login" className="text-center text-gray-700 font-bold border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition">
                Soy Cliente
              </Link>
              <Link to="/register" className="text-center bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
                Empezar Ahora
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION (VIDEO) --- */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        
        {/* 1. Video de Fondo */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          {/* Video abstracto azul (Representa flujo de aire/limpieza) */}
          <source src="https://cdn.pixabay.com/video/2019/04/23/23011-332483109_large.mp4" type="video/mp4" />
        </video>

        {/* 2. Capa Oscura (Overlay) para que se lea el texto */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-900/80 via-blue-800/60 to-transparent z-10"></div>

        {/* 3. Contenido Principal */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid md:grid-cols-2 gap-12 items-center">
          
          {/* Tarjeta de Cristal (Glassmorphism) */}
          <div className="backdrop-blur-md bg-white/20 border border-white/20 p-8 md:p-10 rounded-3xl shadow-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 border border-blue-200 text-blue-700 text-sm font-bold backdrop-blur-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
              Disponible en tu zona
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Expertos en <br/>
              <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-white">
                Aire Fresco
              </span>
            </h1>
            
            <p className="text-lg text-blue-100 mb-8 leading-relaxed">
              Más de 15 años garantizando el confort de tu hogar y empresa. 
              Tecnología de punta, respuesta inmediata y técnicos certificados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-900 cursor-pointer px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2 group">
                Agendar Cita <Wind className="w-5 h-5 group-hover:rotate-10 transition-transform"/>
              </button>
              <button className="px-8 py-4 cursor-pointer rounded-xl text-lg font-bold text-white border border-white/30 hover:bg-white/10 transition flex items-center justify-center gap-2">
                <PlayCircle className="w-5 h-5" /> Ver Servicios
              </button>
            </div>

            {/* Datos Rápidos */}
            <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-3 divide-x divide-white/20">
              <div className="flex flex-col items-center justify-center px-2">
                <p className="text-2xl font-extrabold text-white mb-1">500+</p>
                <p className="text-md sm:text-xs font-bold text-blue-200 uppercase tracking-widest">Clientes</p>
              </div>
              <div className="flex flex-col items-center justify-center px-2">
                <p className="text-2xl font-extrabold text-white mb-1">24/7</p>
                <p className="text-md sm:text-xs font-bold text-blue-200 uppercase tracking-widest">Soporte</p>
              </div>
              <div className="flex flex-col items-center justify-center px-2">
                <p className="text-2xl font-extrabold text-white mb-1">100%</p>
                <p className="text-md sm:text-xs font-bold text-blue-200 uppercase tracking-widest">Garantía</p>
              </div>
            </div>
          </div>

          {/* Espacio vacío para equilibrar el grid (el video llena el fondo) */}
          <div className="hidden md:block"></div>

        </div>
      </section>

      <div className="bg-gray-900 relative overflow-hidden">
        
        {/* Luces Difuminadas (Bolitas) Globales para toda el área */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600 rounded-full blur-[150px] opacity-20 translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>
        <div className="absolute top-[40%] left-0 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[150px] opacity-20 -translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500 rounded-full blur-[150px] opacity-20 translate-x-1/3 translate-y-1/3 pointer-events-none"></div>

        {/* --- 1. SERVICIOS --- */}
        <section id="servicios" className="py-24 relative z-10">
          <div className="max-w-7xl mt-7 mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Soluciones Integrales
              </h2>
              <p className="text-xl text-blue-100 leading-relaxed">
                Diseñamos estrategias de climatización personalizadas para maximizar el confort y la eficiencia energética.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {servicios.map((servicio, index) => (
                <div 
                  key={index} 
                  className="group relative p-8 rounded-3xl bg-white border border-transparent shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                >
                  <div className="mb-6 w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                    {servicio.icono}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                    {servicio.titulo}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-8 flex-1">
                    {servicio.descripcion}
                  </p>
                  <div className="mt-auto flex items-center text-blue-600 font-bold text-sm group-hover:gap-2 transition-all cursor-pointer">
                    Solicitar este servicio <ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 2. TECNOLOGÍA / APP --- */}
        <section id="tecnologia" className="py-24 text-white relative z-10">
          <div className="max-w-7xl mt-7 mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-gray-700 text-blue-400 text-xs font-bold uppercase tracking-wider mb-6">
                  <Smartphone size={14} /> App para Clientes
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Olvídate de llamar. <br/>
                  <span className="text-blue-400">Controla todo online.</span>
                </h2>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                  Con nuestra plataforma, sabes exactamente cuándo llega tu técnico, ves fotos del trabajo realizado y accedes a tu historial de mantenimiento al instante.
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    "Seguimiento de estado en tiempo real",
                    "Historial digital de reparaciones",
                    "Fotos de antes y después",
                    "Facturación automática"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <div className="bg-green-500/20 p-1 rounded-full">
                        <CheckCircle size={16} className="text-green-400" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="inline-flex items-center gap-2 text-white font-bold border-b-2 border-blue-500 pb-1 hover:text-blue-400 hover:border-blue-400 transition">
                  Crear cuenta gratis <ArrowRight size={16} />
                </Link>
              </div>

              <div className="relative mx-auto lg:mx-0">
                <div className="relative w-[300px] md:w-[340px] h-[600px] bg-gray-800 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden transform rotate-6deg hover:rotate-0 transition-transform duration-500">
                  <div className="bg-gray-50 w-full h-full relative flex flex-col">
                    <div className="h-8 bg-white flex justify-between px-6 items-center text-[10px] font-bold text-gray-800">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-gray-800 rounded-sm"></div>
                        <div className="w-3 h-2 bg-gray-800 rounded-sm"></div>
                      </div>
                    </div>
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-gray-800 text-xl">Mi Servicio</h4>
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                          <User size={16}/>
                        </div>
                      </div>
                      <div className="bg-white p-5 rounded-2xl shadow-lg shadow-blue-100/50 mb-6 border border-blue-50">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-blue-600 rounded-xl text-white">
                            <Wind size={20} />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 uppercase font-bold">En curso</p>
                            <p className="font-bold text-gray-800">Mantenimiento Split</p>
                          </div>
                        </div>
                        <div className="space-y-4 pl-2 border-l-2 border-gray-100 ml-4">
                          <div className="relative pl-6">
                            <div className="absolute -left-[5px] top-1 w-2 h-2 bg-green-500 rounded-full ring-4 ring-white"></div>
                            <p className="text-xs text-gray-500">08:30 AM</p>
                            <p className="text-sm font-medium text-gray-800">Técnico asignado</p>
                          </div>
                          <div className="relative pl-6">
                            <div className="absolute -left-[5px] top-1 w-2 h-2 bg-blue-500 rounded-full ring-4 ring-blue-100 animate-pulse"></div>
                            <p className="text-xs text-blue-600 font-bold">Ahora</p>
                            <p className="text-sm font-medium text-blue-700">Trabajando en el equipo</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-200 h-32 rounded-2xl w-full mb-4 flex items-center justify-center text-gray-400 text-xs font-bold">
                        <MapPin size={16} className="mr-1" /> UBICACIÓN DEL TÉCNICO
                      </div>
                      <button className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold text-sm shadow-lg">
                        Contactar Técnico
                      </button>
                    </div>
                  </div>
                </div>
                <div className="absolute top-20 -right-12 bg-white p-4 rounded-2xl shadow-xl animate-bounce duration-3000ms">
                  <Activity className="text-green-500 mb-1" />
                  <p className="text-xs font-bold text-gray-800">Rendimiento +40%</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3. COTIZADOR RÁPIDO --- */}
        <section id="cotizar" className="py-24 text-white relative z-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Cotiza tu servicio en segundos</h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Selecciona el tipo de equipo y el servicio que necesitas para obtener una referencia inmediata.
            </p>

            <div className="bg-white rounded-3xl p-2 md:p-8 shadow-2xl text-gray-800">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 text-left">
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-400 text-sm uppercase">1. Tipo de Equipo</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {['Split', 'Ventana', 'Central', 'Portátil'].map(tipo => (
                      <button key={tipo} className="border cursor-pointer border-gray-200 rounded-xl p-3 hover:border-blue-500 hover:bg-blue-50 transition text-sm font-medium focus:ring-2 ring-blue-500">
                        {tipo}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold text-gray-400 text-sm uppercase">2. Servicio</h3>
                  <div className="space-y-2">
                    {['Mantenimiento Básico', 'Limpieza Profunda', 'Reparación / Falla', 'Instalación Nueva'].map(serv => (
                      <button key={serv} className="cursor-pointer w-full text-left border border-gray-200 rounded-xl p-3 hover:border-blue-500 hover:bg-blue-50 transition text-sm font-medium focus:ring-2 ring-blue-500 flex justify-between">
                        {serv}
                        <span className="text-gray-400">→</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-6 flex flex-col justify-between items-center text-center">
                  <div>
                    <p className="text-gray-500 text-sm mb-2">Precio Estimado desde:</p>
                    <p className="text-4xl font-extrabold text-blue-600 mb-1">$25.000<span className="text-sm text-gray-400 font-normal">*</span></p>
                    <p className="text-xs text-gray-400">*Sujeto a revisión técnica</p>
                  </div>
                  <Link to="/Register" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg mt-6">
                    Agendar Ahora
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="bg-gray-950 text-white pt-20 pb-10 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            {/* Columna 1: Marca y Bio */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg">
                   <Wind className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tight">InstaLar</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Transformamos el clima de tus espacios con tecnología de punta y servicio humano. Tu confort es nuestra misión técnica.
              </p>
              <div className="flex gap-4">
                 {/* Botones Sociales Estilizados */}
                 <a href="#" className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300">
                    <Facebook size={20} />
                 </a>
                 <a href="https://www.instagram.com/instalar_servicios/" className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300">
                    <Instagram size={20} />
                 </a>
                 <a href="mailto:contacto@instalar.com" className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 hover:-translate-y-1 transition-all duration-300">
                    <Mail size={20} />
                 </a>
              </div>
            </div>

            {/* Columna 2: Enlaces Rápidos */}
            <div>
              <h3 className="font-bold text-lg mb-6">Empresa</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                {['Sobre Nosotros', 'Nuestros Servicios', 'Casos de Éxito', 'Trabaja con Nosotros', 'Blog'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400 transition flex items-center gap-2 group">
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 3: Servicios */}
            <div>
              <h3 className="font-bold text-lg mb-6">Servicios</h3>
              <ul className="space-y-4 text-sm text-gray-400">
                {['Mantenimiento Preventivo', 'Instalación Split', 'Reparación de Fugas', 'Carga de Gas', 'Sistemas Centrales'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400 transition flex items-center gap-2 group">
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 4: Newsletter */}
            <div>
              <h3 className="font-bold text-lg mb-6">Mantente Fresco</h3>
              <p className="text-gray-400 text-sm mb-4">
                Recibe tips de mantenimiento y ofertas exclusivas.
              </p>
              <form className="space-y-3">
                <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Tu correo electrónico" 
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                  <button className="absolute cursor-pointer right-2 top-2 p-1.5 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition">
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-600">
                  Al suscribirte aceptas nuestra política de privacidad.
                </p>
              </form>
            </div>

          </div>

          {/* Línea divisoria */}
          <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {añoConcurriente} InstaLar S.A. Todos los derechos reservados.
            </p>
            <div className="flex gap-8 text-sm text-gray-500">
              <a href="#" className="hover:text-white transition">Privacidad</a>
              <a href="#" className="hover:text-white transition">Cookies</a>
              <a href="#" className="hover:text-white transition">Términos</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Inicio;