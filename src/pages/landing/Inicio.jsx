import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Wind,
  Shield,
  Clock,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Star,
  Menu,
  X,
} from "lucide-react";

const Inicio = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const servicios = [
    {
      icono: <Wind className="w-12 h-12 text-blue-500" />,
      titulo: "Mantenimiento Preventivo",
      descripcion:
        "Inspecciones periódicas para garantizar el óptimo funcionamiento de tus equipos de aire acondicionado.",
    },
    {
      icono: <Shield className="w-12 h-12 text-blue-500" />,
      titulo: "Reparación y Diagnóstico",
      descripcion:
        "Técnicos certificados para resolver cualquier falla en tu sistema de climatización rápidamente.",
    },
    {
      icono: <Clock className="w-12 h-12 text-blue-500" />,
      titulo: "Servicio 24/7",
      descripcion:
        "Disponibilidad inmediata para emergencias. Tu comodidad es nuestra prioridad en todo momento.",
    },
  ];

  const testimonios = [
    {
      nombre: "María González",
      empresa: "Corporación XYZ",
      comentario:
        "Excelente servicio, muy profesionales y puntuales. Nuestros equipos funcionan perfectamente.",
      rating: 5,
    },
    {
      nombre: "Carlos Ramírez",
      empresa: "Hotel Paradise",
      comentario:
        "El mejor servicio de mantenimiento. Responden rápido y solucionan todo eficientemente.",
      rating: 5,
    },
    {
      nombre: "Ana Martínez",
      empresa: "Centro Comercial Plaza",
      comentario:
        "Confiables y con precios justos. Llevan años manteniendo nuestros sistemas.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-white scroll-smooth">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Wind className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-2xl font-bold text-gray-800">
                InstaLar
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#inicio"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Inicio
              </a>
              <a
                href="#servicios"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Servicios
              </a>
              <a
                href="#nosotros"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Nosotros
              </a>
              <a
                href="#testimonios"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Testimonios
              </a>
              <a
                href="#contacto"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Contacto
              </a>
            </div>

            <div className="hidden md:block">
              <Link to="/Login" className="mr-4 text-gray-700 hover:text-blue-600 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
                Iniciar Sesión
              </Link>
              <Link to="/Register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Solicitar Servicio
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMenuAbierto(!menuAbierto)}
            >
              {menuAbierto ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {menuAbierto && (
            <div className="md:hidden pb-4">
              <a
                href="#inicio"
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                Inicio
              </a>
              <a
                href="#servicios"
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                Servicios
              </a>
              <a
                href="#nosotros"
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                Nosotros
              </a>
              <a
                href="#testimonios"
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                Testimonios
              </a>
              <a
                href="#contacto"
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                Contacto
              </a>
              <button className="w-full mt-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                Solicitar Servicio
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="inicio"
        className="pt-24 pb-20 bg-linear-to-br from-blue-50 to-blue-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Mantenimiento Profesional de Aire Acondicionado
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Expertos en climatización con más de 15 años de experiencia.
                Mantén tus espacios frescos y confortables todo el año.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition shadow-lg">
                  Agendar Cita
                </button>
                <button className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition border-2 border-blue-600">
                  Ver Servicios
                </button>
              </div>
              <div className="mt-8 flex items-center gap-8">
                <div>
                  <p className="text-3xl font-bold text-blue-600">500+</p>
                  <p className="text-gray-600">Clientes Satisfechos</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">15+</p>
                  <p className="text-gray-600">Años de Experiencia</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">24/7</p>
                  <p className="text-gray-600">Servicio Disponible</p>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-linear-to-br from-blue-400 to-blue-600 rounded-2xl shadow-2xl p-8 aspect-square flex items-center justify-center">
                <Wind className="w-64 h-64 text-white opacity-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios Section */}
      <section id="servicios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrecemos soluciones completas para el mantenimiento y reparación
              de sistemas de climatización
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {servicios.map((servicio, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition border border-gray-100"
              >
                <div className="mb-4">{servicio.icono}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {servicio.titulo}
                </h3>
                <p className="text-gray-600 mb-4">{servicio.descripcion}</p>
                <a
                  href="#contacto"
                  className="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center"
                >
                  Más información →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section id="nosotros" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                ¿Por Qué Elegirnos?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Técnicos Certificados
                    </h3>
                    <p className="text-gray-600">
                      Personal altamente capacitado y con certificaciones
                      internacionales
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Garantía de Servicio
                    </h3>
                    <p className="text-gray-600">
                      Todos nuestros trabajos cuentan con garantía de
                      satisfacción
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Respuesta Rápida
                    </h3>
                    <p className="text-gray-600">
                      Atendemos emergencias en menos de 2 horas
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Precios Competitivos
                    </h3>
                    <p className="text-gray-600">
                      Tarifas justas sin costos ocultos ni sorpresas
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-6">
                Solicita una Cotización Gratis
              </h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  className="w-full px-4 py-3 rounded-lg text-white font-medium hover:bg-blue-700 hover:ring-2 ring-blue-400 transition"
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  className="w-full px-4 py-3 rounded-lg text-white font-medium hover:bg-blue-700 hover:ring-2 ring-blue-400 transition"
                />
                <input
                  type="tel"
                  placeholder="Teléfono"
                  className="w-full px-4 py-3 rounded-lg text-white font-medium hover:bg-blue-700 hover:ring-2 ring-blue-400 transition"
                />
                <textarea
                  placeholder="Describe tu necesidad"
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg text-white font-medium hover:bg-blue-700 hover:ring-2 ring-blue-400 transition"
                ></textarea>
                <button className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                  Enviar Solicitud
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo Que Dicen Nuestros Clientes
            </h2>
            <p className="text-xl text-gray-600">
              Testimonios reales de clientes satisfechos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonios.map((testimonio, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonio.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonio.comentario}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonio.nombre}
                  </p>
                  <p className="text-sm text-gray-500">{testimonio.empresa}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section id="contacto" className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Contáctanos</h2>
              <p className="text-gray-300 mb-8">
                Estamos listos para atender tus necesidades de climatización.
                Contáctanos hoy mismo y obtén una cotización sin compromiso.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="font-semibold">Teléfono</p>
                    <p className="text-gray-300">+34 900 123 456</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-gray-300">info@instalar.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="w-6 h-6 text-blue-400" />
                  <div>
                    <p className="font-semibold">Dirección</p>
                    <p className="text-gray-300">
                      Entre Ríos 212, San Miguel de Tucumán, Argentina
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-gray-800 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-6">Horario de Atención</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Lunes - Viernes:</span>
                    <span className="font-semibold">8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sábados:</span>
                    <span className="font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Domingos:</span>
                    <span className="font-semibold">
                      Emergencias únicamente
                    </span>
                  </div>
                  <div className="mt-6 p-4 bg-blue-600 rounded-lg text-center">
                    <p className="font-semibold">Servicio de Emergencia 24/7</p>
                    <p className="text-sm mt-1">
                      Para urgencias fuera de horario
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Wind className="w-6 h-6 text-blue-400" />
              <span className="ml-2 text-xl font-bold text-white">
                InstaLar
              </span>
            </div>
            <p className="text-sm">
              © 2025 InstaLar. Todos los derechos reservados.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Privacidad
              </a>
              <a href="#" className="hover:text-white transition">
                Términos
              </a>
              <a href="#" className="hover:text-white transition">
                Contacto
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Inicio;
