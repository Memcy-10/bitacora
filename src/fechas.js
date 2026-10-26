// Funciones utilitarias de fechas para bitacora-cli
// Más adelante este módulo se extraerá a un paquete npm independiente

function getTimeStamp() {
  return Date.now();
}

function getLongTime(locale = "es-ES", timestamp = Date.now()) {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short"
  };
  return new Date(timestamp).toLocaleDateString(locale, options);
}

function getShortDate(locale = "es-ES", timestamp = Date.now()) {
  return new Date(timestamp).toLocaleDateString(locale);
}

module.exports = {
  getTimeStamp,
  getLongTime,
  getShortDate,
  // Alias de compatibilidad
  ahora: getTimeStamp,
  formatear: getShortDate
};