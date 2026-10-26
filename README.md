# Bitácora CLI (bitacora-csi)

Aplicación de consola en Node.js para registrar notas y aprendizajes diarios sin salir de la terminal, garantizando identificación única, prevención de duplicados, respaldos periódicos, exportación de archivos y modularización con un paquete npm externo de fechas.

Desarrollado por: **Maicol Montoya**

---

## Características principales

- **Gestión completa de notas**: Permite agregar, listar, buscar y borrar notas.
- **Identificador único con `object-hash`**: Genera un identificador de 8 caracteres a partir del texto y evita duplicados automáticamente.
- **Persistencia en JSON**: Almacena las notas en `data/notas.json` y registra un log de auditoría en `data/bitacora.log`.
- **Respaldos y exportaciones seguras**: Respalda en `respaldos/notas_<timestamp>.json` y exporta notas legibles a rutas absolutas manejando posibles conflictos entre unidades de disco (`EXDEV`).
- **Módulo externo de fechas (`npm link`)**: Fechas gestionadas a través del paquete modular independiente `fechas-bitacora-maicol`.
- **Manejo controlado de errores**: Valida argumentos numéricos, textos vacíos, IDs inexistentes y archivos JSON corruptos sin provocar caídas del programa (*crashes*).

---

## Instalación y Configuración

1. Clonar el repositorio o ubicarse en la carpeta del proyecto:
```bash
cd bitacora-csi
```

2. Instalar las dependencias locales del proyecto:
```bash
npm install
```

3. Vincular el paquete utilitario de fechas:
```bash
# Dentro de la carpeta del paquete de fechas:
cd ../fechas-bitacora-maicol
npm link

# Dentro de la carpeta bitacora-csi:
cd ../bitacora-csi
npm link fechas-bitacora-maicol
```

---

## Comandos Disponibles

| Comando | Sintaxis | Descripción | Ejemplo |
|---|---|---|---|
| **agregar** | `npm start -- agregar "<texto>" [etiqueta]` | Guarda una nueva nota. La etiqueta por defecto es `general`. Rechaza duplicados. | `npm start -- agregar "Hoy aprendí a usar fs" nodejs` |
| **listar** | `npm start -- listar [N]` | Muestra las últimas N notas (por defecto 5). Si N no es válido, usa 5 y notifica. | `npm start -- listar 3` |
| **buscar** | `npm start -- buscar <palabra>` | Busca notas cuyo texto contenga la palabra (insensible a mayúsculas/minúsculas). | `npm start -- buscar fs` |
| **borrar** | `npm start -- borrar <id>` | Elimina la nota con el ID especificado. | `npm start -- borrar 613402ea` |
| **respaldar** | `npm start -- respaldar` | Copia `data/notas.json` a `respaldos/notas_<timestamp>.json`. | `npm start -- respaldar` |
| **exportar** | `npm start -- exportar [carpeta-destino]` | Genera `salida/exportacion.txt` y lo mueve a una ruta absoluta (por defecto `os.homedir()`). | `npm start -- exportar` |
| **ayuda** | `npm start -- ayuda` | Muestra el menú de comandos disponibles y su sintaxis. | `npm start -- ayuda` |

---

## Estructura del Proyecto

```text
bitacora-csi/
├── src/
│   ├── index.js      # Entrada principal: procesa argumentos y ejecuta comandos
│   ├── notas.js      # Lógica de negocio y orquestación
│   └── almacen.js    # Capa de persistencia con fs, respaldos y logs
├── data/             # Creada automáticamente (notas.json y bitacora.log)
├── respaldos/        # Creada automáticamente al respaldar
├── salida/           # Directorio temporal de exportaciones
├── evidencias/       # Capturas y registro de pruebas del taller
├── .gitignore        # Excluye node_modules/, data/ y respaldos/
├── package.json      # Configuración del paquete, scripts y dependencias
└── README.md         # Documentación y reflexión teórica
```

---

## Parte 5: Reflexión y Respuestas Teóricas

### 1. ¿Por qué elegiste CommonJS o ES Modules? ¿Qué cambió en tu package.json y en la forma de importar?
Se eligió CommonJS (`"type": "commonjs"`) por ser el sistema estándar tradicional de Node.js, permitiendo una integración directa y síncrona con el sistema de archivos (`fs`) sin requerir configuraciones de transpilación. En `package.json` se mantuvo `"type": "commonjs"`, y en el código se utilizaron las sentencias `require()` y `module.exports` en lugar de las directivas `import` y `export` de ES Modules.

### 2. fs, object-hash y fechas (tu paquete) se importan distinto del módulo local notas.js. ¿Cuál es la diferencia y cómo decide Node dónde buscar cada uno?
El módulo local `notas.js` se importa mediante una ruta relativa (`./notas.js`), indicándole a Node que resuelva el archivo dentro de la carpeta actual. En cambio, `fs` es un módulo del núcleo de Node que se carga de inmediato desde el ejecutable, mientras que `object-hash` y `fechas-bitacora-maicol` no usan prefijos de ruta, por lo que Node los busca secuencialmente en el directorio `node_modules` de la raíz del proyecto.

### 3. ¿Por qué data/notas.json se resuelve distinto si ejecutas el programa desde otra carpeta?
Porque las rutas relativas directas dependen del directorio de trabajo actual (`process.cwd()`), es decir, de la ubicación desde la cual se invoca la terminal. Si se ejecuta desde `src/`, Node buscaría `src/data/notas.json`; por esta razón se utilizó `path.join(__dirname, '..', 'data', 'notas.json')`, asegurando que la ruta siempre se calcule respecto a la ubicación del archivo fuente y no desde la consola.

### 4. ¿Por qué node_modules/ no se sube a Git y cómo recupera otra persona las dependencias?
`node_modules/` contiene miles de ficheros dependientes de la arquitectura del sistema operativo y ocupa un gran volumen de almacenamiento innecesario en el historial del repositorio. Gracias a que `package.json` y `package-lock.json` registran de forma determinista los paquetes y versiones exactas requeridas, cualquier desarrollador solo debe clonar el código y ejecutar `npm install` para reconstruir la carpeta en su equipo.

### 5. ¿Qué diferencia viste al importar tu paquete CommonJS desde tu proyecto?
Al enlazar el paquete con `npm link`, fue posible importarlo como una dependencia externa formal (`require("fechas-bitacora-maicol")`) sin recurrir a rutas locales relativas como `require("./fechas.js")`. Esto desacopló por completo la responsabilidad del formateo de fechas del núcleo de la bitácora, emulando con exactitud el consumo de un paquete publicado en el registro de npm.