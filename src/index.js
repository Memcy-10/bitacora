const notas = require("./notas");
const almacen = require("./almacen");

const args = process.argv.slice(2);
const comando = args[0];

function mostrarAyuda() {
  console.log(`
==================================================
           BITACORA CLI - MANUAL DE USO
==================================================

Comandos disponibles:
  agregar "<texto>" [etiqueta]   Guarda una nueva nota (etiqueta por defecto: "general")
  listar [N]                     Muestra las ultimas N notas (por defecto: 5)
  buscar <palabra>               Busca notas que contengan la palabra indicada
  borrar <id>                    Elimina la nota con el id correspondiente
  respaldar                      Copia data/notas.json a la carpeta respaldos/
  exportar [carpeta-destino]     Genera exportacion.txt y lo mueve a una ruta absoluta
  ayuda                          Muestra este mensaje de ayuda

Ejemplos de uso:
  npm start -- agregar "Hoy aprendí a usar fs" nodejs
  npm start -- listar 3
  npm start -- buscar fs
  npm start -- borrar 3f9a1c2e
  npm start -- respaldar
  npm start -- exportar
==================================================`);
  almacen.registrarLog("ayuda", "Mostrada ayuda");
}

function ejecutar() {
  if (!comando || comando === "ayuda" || comando === "--help" || comando === "-h") {
    mostrarAyuda();
    return;
  }

  try {
    switch (comando) {
      case "agregar": {
        const texto = args[1];
        const etiqueta = args[2];

        if (!texto || typeof texto !== "string" || !texto.trim()) {
          console.log("Error: Debes escribir el texto de la nota entre comillas. Ejemplo: npm start -- agregar \"Mi nota\" nodejs");
          almacen.registrarLog("agregar", "Error: Texto vacio o ausente");
          return;
        }

        try {
          const nota = notas.agregar(texto, etiqueta);
          console.log(`Nota guardada [${nota.id}] (${nota.etiqueta}) — ${nota.fechaFormateada}`);
          almacen.registrarLog("agregar", `Nota guardada [${nota.id}] (${nota.etiqueta})`);
        } catch (error) {
          console.log(error.message);
          almacen.registrarLog("agregar", error.message);
        }
        break;
      }

      case "listar": {
        const argCantidad = args[1];
        let cantidad = 5;

        if (argCantidad !== undefined) {
          const num = Number(argCantidad);
          if (Number.isNaN(num) || num <= 0) {
            console.log(`Aviso: El valor "${argCantidad}" no es valido. Se mostraran las ultimas 5 notas por defecto.`);
            cantidad = 5;
          } else {
            cantidad = Math.floor(num);
          }
        }

        const lista = notas.listar(cantidad);
        if (lista.length === 0) {
          console.log("No hay notas guardadas actualmente.");
          almacen.registrarLog("listar", "Lista vacia");
          return;
        }

        for (const nota of lista) {
          console.log(`[${nota.id}] (${nota.etiqueta}) ${nota.fechaFormateada} — ${nota.texto}`);
        }
        almacen.registrarLog("listar", `Mostradas ${lista.length} nota(s)`);
        break;
      }

      case "buscar": {
        const palabra = args[1];
        if (!palabra || typeof palabra !== "string" || !palabra.trim()) {
          console.log("Error: Debes indicar la palabra que deseas buscar. Ejemplo: npm start -- buscar fs");
          almacen.registrarLog("buscar", "Error: Palabra de busqueda ausente");
          return;
        }

        const resultados = notas.buscar(palabra);
        if (resultados.length === 0) {
          console.log(`No se encontraron notas con la palabra "${palabra}".`);
          almacen.registrarLog("buscar", `Sin resultados para "${palabra}"`);
          return;
        }

        for (const nota of resultados) {
          console.log(`[${nota.id}] (${nota.etiqueta}) ${nota.fechaFormateada} — ${nota.texto}`);
        }
        almacen.registrarLog("buscar", `Encontradas ${resultados.length} nota(s) para "${palabra}"`);
        break;
      }

      case "borrar": {
        const id = args[1];
        if (!id || typeof id !== "string" || !id.trim()) {
          console.log("Error: Debes indicar el id de la nota a borrar. Ejemplo: npm start -- borrar 3f9a1c2e");
          almacen.registrarLog("borrar", "Error: Id ausente");
          return;
        }

        try {
          const mensaje = notas.borrar(id);
          console.log(mensaje);
          almacen.registrarLog("borrar", mensaje);
        } catch (error) {
          console.log(`Error: ${error.message}`);
          almacen.registrarLog("borrar", `Error: ${error.message}`);
        }
        break;
      }

      case "respaldar": {
        try {
          const resultado = notas.respaldar();
          console.log(`Respaldo creado exitosamente: ${resultado.nombre}`);
          almacen.registrarLog("respaldar", `Respaldo creado: ${resultado.nombre}`);
        } catch (error) {
          console.log(`Error al crear el respaldo: ${error.message}`);
          almacen.registrarLog("respaldar", `Error: ${error.message}`);
        }
        break;
      }

      case "exportar": {
        const carpetaDestino = args[1];
        try {
          const rutaFinal = notas.exportar(carpetaDestino);
          console.log(`Notas exportadas exitosamente a: ${rutaFinal}`);
          almacen.registrarLog("exportar", `Exportado a: ${rutaFinal}`);
        } catch (error) {
          console.log(`Error al exportar: ${error.message}`);
          almacen.registrarLog("exportar", `Error: ${error.message}`);
        }
        break;
      }

      default: {
        console.log(`Comando no reconocido: "${comando}"`);
        mostrarAyuda();
        almacen.registrarLog(comando, "Comando desconocido");
        break;
      }
    }
  } catch (error) {
    console.log(`Ocurrio un error inesperado: ${error.message}`);
    almacen.registrarLog(comando || "desconocido", `Crash evitado: ${error.message}`);
  }
}

ejecutar();