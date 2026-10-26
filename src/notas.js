// object-hash permite hashear objetos; lo usamos para generar el id de cada nota
const hash = require("object-hash");

// notas.js NO toca el archivo: todo el acceso a datos pasa por almacen
const almacen = require("./almacen");

// Crea la nota: valida, genera el id, arma el objeto y se lo pasa al almacén
function agregar(texto, etiqueta) {
  // Se valida primero para no hashear ni guardar datos basura
  if (typeof texto !== "string" || !texto.trim()) {
    throw new Error(`El texto de la nota es obligatorio.`);
  }

  // hash exige un objeto, por eso { id: ... }. Mismo texto -> mismo id,
  // así almacen detecta y rechaza las repetidas. substring deja solo 8 caracteres
  const id = hash({ id: texto.trim() }).substring(0, 8);

  const nota = {
    id,
    texto: texto.trim(),              // se guarda sin espacios sobrantes
    etiqueta: etiqueta ?? "sin etiqueta", // valor por defecto si no envían etiqueta
    fecha: Date.now(),                // número: simple de guardar y de ordenar
  };

  // Si el id ya existe, almacen lanza el error y la nota no se guarda
  almacen.agregar(nota);

  // Se devuelve para que quien llame sepa qué id se generó
  return nota;
}

// Convierte la nota guardada en una forma lista para mostrar:
// la fecha numérica pasa a texto legible. No modifica el original (copia con spread)
function formatear(nota) {
  return { ...nota, fecha: new Date(nota.fecha).toLocaleString("es-CO") };
}

// Lista las notas ya formateadas; si se envía n, solo devuelve las últimas n
function listar(n) {
  const notas = almacen.listar().map(formatear);
  return n ? notas.slice(-n) : notas;
}

// Busca una nota por id y la devuelve formateada, o null si no existe
function buscar(id) {
  const nota = almacen.obtener(id);
  return nota ? formatear(nota) : null;
}

// Elimina por id y responde con un mensaje en español según el resultado
// (almacen.eliminar devuelve true si borró y false si no encontró la nota)
function borrar(id) {
  return almacen.eliminar(id)
    ? `La nota ${id} se eliminó correctamente.`
    : `No se encontró ninguna nota con el id ${id}.`;
}

// Solo estas 4 funciones son públicas; formatear queda como detalle interno
module.exports = { agregar, listar, buscar, borrar };