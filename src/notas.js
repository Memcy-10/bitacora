const hash = require("object-hash");
const almacen = require("./almacen");
const fechas = require("fechas-bitacora-maicol");

// Agrega una nueva nota
function agregar(texto, etiqueta) {
  if (typeof texto !== "string" || !texto.trim()) {
    throw new Error("El texto de la nota es obligatorio.");
  }

  const limpio = texto.trim();
  const id = hash(limpio.toLowerCase()).substring(0, 8);

  const nota = {
    id,
    texto: limpio,
    etiqueta: etiqueta && etiqueta.trim() ? etiqueta.trim() : "general",
    fecha: fechas.getTimeStamp ? fechas.getTimeStamp() : fechas.ahora()
  };

  almacen.agregar(nota);

  // Retorna nota con fecha formateada en formato largo
  const fechaLarga = fechas.getLongTime
    ? fechas.getLongTime("es-ES", nota.fecha)
    : fechas.formatear(nota.fecha);

  return {
    ...nota,
    fechaFormateada: fechaLarga
  };
}

// Lista las notas formateadas con fecha corta
function listar(n) {
  const todas = almacen.listar();
  const seleccionadas = typeof n === "number" && n > 0 ? todas.slice(-n) : todas;

  return seleccionadas.map((nota) => ({
    ...nota,
    fechaFormateada: fechas.getShortDate
      ? fechas.getShortDate("es-ES", nota.fecha)
      : fechas.formatear(nota.fecha)
  }));
}

// Busca notas que contengan la palabra (sin distinguir mayusculas/minusculas)
function buscar(palabra) {
  if (typeof palabra !== "string" || !palabra.trim()) {
    throw new Error("Debes indicar una palabra para buscar.");
  }

  const clave = palabra.trim().toLowerCase();
  const todas = almacen.listar();

  return todas
    .filter((nota) => nota.texto.toLowerCase().includes(clave))
    .map((nota) => ({
      ...nota,
      fechaFormateada: fechas.getShortDate
        ? fechas.getShortDate("es-ES", nota.fecha)
        : fechas.formatear(nota.fecha)
    }));
}

// Elimina una nota por id
function borrar(id) {
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Debes indicar el id de la nota a borrar.");
  }

  const eliminado = almacen.eliminar(id.trim());
  if (!eliminado) {
    throw new Error(`No existe ninguna nota con el id ${id}.`);
  }

  return `Nota [${id}] eliminada correctamente.`;
}

// Realiza respaldo de las notas
function respaldar() {
  return almacen.respaldar();
}

// Exporta las notas a archivo de texto y lo mueve a destino
function exportar(destino) {
  return almacen.exportar(destino);
}

module.exports = {
  agregar,
  listar,
  buscar,
  borrar,
  respaldar,
  exportar
};