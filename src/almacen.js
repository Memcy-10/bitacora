const fs = require("fs");
const path = require("path");

// path.join con __dirname: la ruta no depende de desde dónde ejecutes node
const carpeta = path.join(__dirname, "datos", "logs");
const archivo = path.join(carpeta, "notas.txt");

// recursive: crea las carpetas que falten y no falla si ya existen
fs.mkdirSync(carpeta, { recursive: true });

// ---------- PRIVADAS (no se exportan) ----------

// Texto del archivo -> array de objetos. Una nota por línea.
function leerTodas() {
  if (!fs.existsSync(archivo)) return []; // si no existe aún, no hay notas

  return fs
    .readFileSync(archivo, "utf8")
    .split("\n")
    .filter((linea) => linea.trim())       // descarta líneas vacías
    .map((linea) => JSON.parse(linea));    // texto -> objeto
}

// Array de objetos -> texto en el archivo. Se usa al editar el contenido.
function reescribir(notas) {
  const contenido = notas.map((n) => JSON.stringify(n)).join("\n");
  fs.writeFileSync(archivo, contenido ? `${contenido}\n` : "");
}

// ---------- PÚBLICAS (las 4 que se exportan) ----------

// Rechaza repetidas: si el id ya existe, no escribe nada
function agregar(nota) {
  if (leerTodas().some((n) => n.id === nota.id)) {
    throw new Error(`Ya existe una nota con el id ${nota.id}.`);
  }
  // appendFileSync solo añade al final, sin leer ni reescribir todo
  fs.appendFileSync(archivo, `${JSON.stringify(nota)}\n`);
}

// Devuelve todas las notas (objetos tal cual se guardaron)
function listar() {
  return leerTodas();
}

// Busca una por id; null si no existe
function obtener(id) {
  return leerTodas().find((n) => n.id === id) ?? null;
}

// Borra por id. Devuelve true si la borró, false si no existía
function eliminar(id) {
  const notas = leerTodas();
  const restantes = notas.filter((n) => n.id !== id);

  if (restantes.length === notas.length) return false;

  reescribir(restantes); // hay que reescribir todo porque se quitó una línea
  return true;
}

module.exports = { agregar, listar, obtener, eliminar };