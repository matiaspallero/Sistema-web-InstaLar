function CalendarioMantenimiento({ eventos, currentDate, viewMode }) {
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getEventosDelDia = (dia) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    return eventos.filter(evento => evento.fecha === dateStr);
  };

  const getTipoColor = (tipo) => {
    const colores = {
      'mantenimiento': 'bg-blue-500',
      'reparacion': 'bg-red-500',
      'instalacion': 'bg-green-500',
      'revision': 'bg-purple-500'
    };
    return colores[tipo] || 'bg-gray-500';
  };

  const isToday = (dia) => {
    const today = new Date();
    return (
      dia === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Encabezado de días */}
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        {dias.map((dia) => (
          <div key={dia} className="p-4 text-center font-semibold text-gray-700 text-sm">
            {dia}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7">
        {/* Días vacíos antes del primer día del mes */}
        {[...Array(startingDayOfWeek)].map((_, index) => (
          <div key={`empty-${index}`} className="min-h-[120px] p-2 border border-gray-100 bg-gray-50"></div>
        ))}

        {/* Días del mes */}
        {[...Array(daysInMonth)].map((_, index) => {
          const dia = index + 1;
          const eventosDelDia = getEventosDelDia(dia);
          const today = isToday(dia);

          return (
            <div
              key={dia}
              className={`min-h-[120px] p-2 border border-gray-100 hover:bg-gray-50 transition-colors ${
                today ? 'bg-blue-50' : ''
              }`}
            >
              <div className={`text-sm font-semibold mb-2 ${
                today 
                  ? 'bg-blue-600 text-white w-7 h-7 rounded-full flex items-center justify-center' 
                  : 'text-gray-700'
              }`}>
                {dia}
              </div>
              <div className="space-y-1">
                {eventosDelDia.slice(0, 3).map((evento) => (
                  <div
                    key={evento.id}
                    className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity ${getTipoColor(evento.tipo)}`}
                    title={`${evento.titulo} - ${evento.horaInicio}`}
                  >
                    {evento.horaInicio} {evento.titulo}
                  </div>
                ))}
                {eventosDelDia.length > 3 && (
                  <div className="text-xs text-gray-500 pl-1">
                    +{eventosDelDia.length - 3} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarioMantenimiento;