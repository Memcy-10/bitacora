// fechas.js solo sabe de fechas: no conoce notas ni archivos

// Devuelve la fecha actual como número (milisegundos desde 1970).
// Se guarda como número porque es simple de almacenar en JSON y fácil de ordenar
function ahora() {
  return Date.now();
}

// Convierte el número guardado en texto legible en español de Colombia.
// Ejemplo: 1761350000000 -> "24/10/2025, 6:33:20 p. m."
function formatear(milisegundos) {
  return new Date(milisegundos).toLocaleString("es-CO");
}

module.exports = { ahora, formatear };