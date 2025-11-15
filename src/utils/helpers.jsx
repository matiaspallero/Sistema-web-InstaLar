// Formatear fecha
export const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Formatear moneda
export const formatearMoneda = (monto) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(monto);
};

// Validar email
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar teléfono
export const validarTelefono = (telefono) => {
  const regex = /^[0-9]{9,}$/;
  return regex.test(telefono.replace(/[\s-]/g, ''));
};

// Calcular días entre fechas
export const diasEntreFechas = (fecha1, fecha2) => {
  const diff = Math.abs(new Date(fecha2) - new Date(fecha1));
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Generar color aleatorio
export const generarColorAleatorio = () => {
  const colores = [
    'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  return colores[Math.floor(Math.random() * colores.length)];
};

// Truncar texto
export const truncarTexto = (texto, longitud = 50) => {
  if (texto.length <= longitud) return texto;
  return texto.substring(0, longitud) + '...';
};

// Capitalizar primera letra
export const capitalizarPrimeraLetra = (texto) => {
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

// Obtener iniciales
export const obtenerIniciales = (nombre) => {
  return nombre
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Calcular porcentaje
export const calcularPorcentaje = (valor, total) => {
  if (total === 0) return 0;
  return Math.round((valor / total) * 100);
};