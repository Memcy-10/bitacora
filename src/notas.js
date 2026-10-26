// object-hash permite hashear objetos; lo usamos para generar el id de cada nota
const hash = require("object-hash");

// notas.js NO toca el archivo: todo el acceso a datos pasa por almacen
const almacen = require("./almacen");

// NUEVO: toda la lógica de fechas vive en fechas.js
const fechas = require("./fechas");

// Crea la nota: valida, genera el id, arma el objeto y se lo pasa al almacén
function agregar(texto, etiqueta) {
  // Se valida primero para no hashear ni guardar datos basura
  if (typeof texto !== "string" || !texto.trim()) {
    throw new Error(`El texto de la nota es obligatorio.`);
  }

  // "limpio" es el texto que se guarda, sin espacios sobrantes
  const limpio = texto.trim();

  // toLowerCase solo afecta al hash: "Hoy" y "hoy" dan el mismo id y se detectan
  // como repetidas, pero el texto guardado conserva lo que escribió el usuario
  const id = hash({ id: limpio.toLowerCase() }).substring(0, 8);

  const nota = {
    id,
    texto: limpio,
    etiqueta: etiqueta ?? "sin etiqueta",
    fecha: fechas.ahora(), // CAMBIO: antes era Date.now() directo
  };

  // Si el id ya existe, almacen lanza el error y la nota no se guarda
  almacen.agregar(nota);

  // Se devuelve para que quien llame sepa qué id se generó
  return nota;
}

// Prepara la nota para mostrarla: la fecha numérica pasa a texto legible.
// CAMBIO: la conversión la hace fechas.formatear; aquí solo se copia la nota (spread)
// para no modificar el original
function formatear(nota) {
  return { ...nota, fecha: fechas.formatear(nota.fecha) };
}

// Lista las notas ya formateadas; si se envía n, solo devuelve las últimas n
function listar(n) {
  const notas = almacen.listar().map(formatear);
  return n ? notas.slice(-n) : notas;
}

// Busca por palabra dentro del texto y devuelve TODAS las coincidencias, formateadas.
// toLowerCase en ambos lados: así no distingue mayúsculas de minúsculas
function buscar(palabra) {
  const clave = palabra.trim().toLowerCase();

  return almacen
    .listar()
    .filter((nota) => nota.texto.toLowerCase().includes(clave))
    .map(formatear);
}

// Elimina por id y responde con un mensaje en español según el resultado
function borrar(id) {
  return almacen.eliminar(id)
    ? `La nota ${id} se eliminó correctamente.`
    : `No se encontró ninguna nota con el id ${id}.`;
}

// Solo estas 4 funciones son públicas; formatear queda como detalle interno
module.exports = { agregar, listar, buscar, borrar };