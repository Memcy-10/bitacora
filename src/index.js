const args = process.argv.slice(2);
const notas = require("./notas.js");

// Punto de entrada: decide qué hacer según el primer argumento (el comando)
function sistema() {
  const [comando, valor, extra] = args;

  // try/catch: los errores (texto vacío, nota repetida) se muestran como mensaje y no como crash
  try {
    if (comando === "agregar") {
      agregarTexto(valor, extra);
    } else if (comando === "listar") {
      listarNotas(valor);
    } else if (comando === "buscar") {
      buscarPalabra(valor);
    } else if (comando === "borrar") {
      borrarId(valor);
    } else {
      ayudarUsuario();
    }
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

// La etiqueta llega como tercer argumento; si no viene (undefined), se aplica "general"
function agregarTexto(texto, etiqueta = "general") {
  if (typeof texto !== "string") {
    console.log(`Debes escribir el texto de la nota entre comillas.`);
    return;
  }
  const nota = notas.agregar(texto, etiqueta);
  console.log(`Nota guardada con el id ${nota.id}.`);
}

// process.argv entrega strings, por eso se convierte con Number.
// Sin cantidad se listan todas las notas
function listarNotas(cantidad) {
  const n = cantidad ? Number(cantidad) : undefined;

  if (cantidad && (Number.isNaN(n) || n <= 0)) {
    console.log(`El valor de listar debe ser un número mayor que 0.`);
    return;
  }
  console.log(`Las notas son:`, notas.listar(n));
}

// Busca por palabra sin distinguir mayúsculas; el resultado es un array (varias notas o ninguna)
function buscarPalabra(palabra) {
  if (typeof palabra !== "string" || !palabra.trim()) {
    console.log(`Debes indicar la palabra a buscar.`);
    return;
  }

  const resultados = notas.buscar(palabra);

  if (resultados.length === 0) {
    console.log(`No se encontraron notas con la palabra "${palabra}".`);
    return;
  }

  console.log(`Se encontraron ${resultados.length} nota(s) con "${palabra}":`, resultados);
}

// El id es un string (hash de 8 caracteres), no un número.
// notas.borrar ya devuelve el mensaje en español
function borrarId(id) {
  if (typeof id !== "string") {
    console.log(`Debes indicar el id de la nota a borrar.`);
    return;
  }
  console.log(notas.borrar(id));
}

// Se muestra cuando el comando no existe o no se envía ninguno
function ayudarUsuario() {
  console.log(
    `Los comandos disponibles son:
  agregar "texto" <etiqueta>
  listar <N>
  buscar <palabra>
  borrar <id>`
  );
}

sistema();