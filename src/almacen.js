const fs = require("fs");
const path = require("path");
const os = require("os");

// Rutas resueltas con path.join y __dirname para no depender de la carpeta de ejecucion
const carpetaData = path.join(__dirname, "..", "data");
const archivoNotas = path.join(carpetaData, "notas.json");
const archivoLog = path.join(carpetaData, "bitacora.log");
const carpetaRespaldos = path.join(__dirname, "..", "respaldos");
const carpetaSalida = path.join(__dirname, "..", "salida");

// Asegura que la carpeta data exista
function asegurarCarpetaData() {
  if (!fs.existsSync(carpetaData)) {
    fs.mkdirSync(carpetaData, { recursive: true });
  }
}

// Lee las notas del archivo data/notas.json
// Controla que si no existe lo cree con [], y si esta dañado muestre mensaje sin romper el programa
function leerTodas() {
  asegurarCarpetaData();

  if (!fs.existsSync(archivoNotas)) {
    fs.writeFileSync(archivoNotas, JSON.stringify([], null, 2), "utf8");
    return [];
  }

  try {
    const contenido = fs.readFileSync(archivoNotas, "utf8").trim();
    if (!contenido) return [];
    const datos = JSON.parse(contenido);
    if (!Array.isArray(datos)) {
      console.log("Error: El archivo notas.json no contiene una lista valida. Se usara una lista vacia.");
      return [];
    }
    return datos;
  } catch (error) {
    console.log("Error: El archivo notas.json esta dañado o no tiene formato JSON valido.");
    return [];
  }
}

// Guarda el array de notas en data/notas.json
function guardarTodas(notas) {
  asegurarCarpetaData();
  fs.writeFileSync(archivoNotas, JSON.stringify(notas, null, 2), "utf8");
}

// Registra cada accion en data/bitacora.log con appendFileSync
function registrarLog(comando, resultado) {
  asegurarCarpetaData();
  const fecha = new Date().toISOString();
  const linea = `${fecha} | ${comando} | ${resultado}\n`;
  fs.appendFileSync(archivoLog, linea, "utf8");
}

// Agrega una nueva nota verificando duplicados
function agregar(nota) {
  const notas = leerTodas();
  const existente = notas.find((n) => n.id === nota.id);
  if (existente) {
    throw new Error(`Ya existe una nota igual (id ${nota.id}). No se guardó.`);
  }

  notas.push(nota);
  guardarTodas(notas);
}

// Lista todas las notas existentes
function listar() {
  return leerTodas();
}

// Obtiene una nota por su id
function obtener(id) {
  return leerTodas().find((n) => n.id === id) ?? null;
}

// Elimina una nota por su id
function eliminar(id) {
  const notas = leerTodas();
  const restantes = notas.filter((n) => n.id !== id);

  if (restantes.length === notas.length) {
    return false;
  }

  guardarTodas(restantes);
  return true;
}

// Copia data/notas.json a respaldos/notas_<timestamp>.json
function respaldar() {
  asegurarCarpetaData();
  if (!fs.existsSync(archivoNotas)) {
    leerTodas();
  }

  if (!fs.existsSync(carpetaRespaldos)) {
    fs.mkdirSync(carpetaRespaldos, { recursive: true });
  }

  const timestamp = Date.now();
  const nombreRespaldo = `notas_${timestamp}.json`;
  const rutaDestino = path.join(carpetaRespaldos, nombreRespaldo);

  fs.copyFileSync(archivoNotas, rutaDestino);
  return { ruta: rutaDestino, nombre: nombreRespaldo, timestamp };
}

// Exporta las notas a salida/exportacion.txt y luego lo mueve a la carpeta absoluta indicada
function exportar(destinoPersonalizado) {
  const destino = destinoPersonalizado || os.homedir();

  // Validaciones de destino
  if (!path.isAbsolute(destino)) {
    throw new Error(`La ruta de destino "${destino}" no es absoluta.`);
  }

  if (!fs.existsSync(destino) || !fs.statSync(destino).isDirectory()) {
    throw new Error(`La carpeta de destino "${destino}" no existe o no es un directorio.`);
  }

  if (!fs.existsSync(carpetaSalida)) {
    fs.mkdirSync(carpetaSalida, { recursive: true });
  }

  const notas = leerTodas();
  const rutaTemporal = path.join(carpetaSalida, "exportacion.txt");
  const rutaFinal = path.join(destino, "exportacion.txt");

  // Generar contenido legible
  const lineas = [
    "==================================================",
    "BITACORA CLI - EXPORTACION DE NOTAS",
    `Fecha de exportacion: ${new Date().toLocaleString("es-ES")}`,
    `Total de notas: ${notas.length}`,
    "==================================================",
    ""
  ];

  for (const nota of notas) {
    lineas.push(`[${nota.id}] (${nota.etiqueta}) - Fecha timestamp: ${nota.fecha}`);
    lineas.push(`Texto: ${nota.texto}`);
    lineas.push("--------------------------------------------------");
  }

  fs.writeFileSync(rutaTemporal, lineas.join("\n"), "utf8");

  // Mover archivo manejando posible error EXDEV (distintos discos)
  try {
    fs.renameSync(rutaTemporal, rutaFinal);
  } catch (error) {
    if (error.code === "EXDEV") {
      fs.copyFileSync(rutaTemporal, rutaFinal);
      fs.unlinkSync(rutaTemporal);
    } else {
      throw error;
    }
  }

  // Verificar que ya no exista en salida/
  if (fs.existsSync(rutaTemporal)) {
    fs.unlinkSync(rutaTemporal);
  }

  return rutaFinal;
}

module.exports = {
  agregar,
  listar,
  obtener,
  eliminar,
  registrarLog,
  respaldar,
  exportar
};