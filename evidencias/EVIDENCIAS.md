# Evidencias del Taller - Bitácora CLI

Este documento recopila las pruebas de ejecución y resultados de cada uno de los puntos requeridos en el taller de Node.js.

---

## 1. Sesión de uso con los 7 comandos

### Comando 1: ayuda
```bash
$ npm start -- ayuda

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
==================================================
```

### Comando 2: agregar
```bash
$ npm start -- agregar "Hoy aprendí a usar fs" nodejs
Nota guardada [613402ea] (nodejs) — lunes, 26 de octubre de 2026, 15:39:13 GMT-5

$ npm start -- agregar "Entendiendo módulos nativos y externos" arquitectura
Nota guardada [f93d7cf9] (arquitectura) — lunes, 26 de octubre de 2026, 15:39:25 GMT-5
```

### Comando 3: listar
```bash
$ npm start -- listar 3
[613402ea] (nodejs) 26/10/2026 — Hoy aprendí a usar fs
[f93d7cf9] (arquitectura) 26/10/2026 — Entendiendo módulos nativos y externos
```

### Comando 4: buscar
```bash
$ npm start -- buscar fs
[613402ea] (nodejs) 26/10/2026 — Hoy aprendí a usar fs
```

### Comando 5: respaldar
```bash
$ npm start -- respaldar
Respaldo creado exitosamente: notas_1793047254071.json
```

### Comando 6: exportar
```bash
$ npm start -- exportar
Notas exportadas exitosamente a: C:\Users\maico\Documents\exportacion.txt
```

### Comando 7: borrar
```bash
$ npm start -- borrar 613402ea
Nota [613402ea] eliminada correctamente.

# Intento de borrado con id inexistente:
$ npm start -- borrar 613402ea
Error: No existe ninguna nota con el id 613402ea.
```

---

## 2. Rechazo de una nota duplicada

Al intentar registrar la misma nota por segunda vez:
```bash
$ npm start -- agregar "Hoy aprendí a usar fs" nodejs
Ya existe una nota igual (id 613402ea). No se guardó.
```

---

## 3. Manejo controlado de `notas.json` dañado

Se introdujo contenido no estructurado (texto basura) directamente en `data/notas.json`:
```bash
$ Set-Content -Path "data/notas.json" -Value "texto basura corrupto {[[["
$ npm start -- listar
Error: El archivo notas.json esta dañado o no tiene formato JSON valido.
No hay notas guardadas actualmente.
```
El programa no genera excepción no controlada (`crash`) y reporta claramente el inconveniente al usuario.

---

## 4. Salida de `npm publish --dry-run`

Ejecutado dentro del paquete independiente `fechas-bitacora-maicol`:
```bash
$ cd ../fechas-bitacora-maicol
$ npm publish --dry-run
npm notice
npm notice package: fechas-bitacora-maicol@1.0.0
npm notice Tarball Contents
npm notice 1.5kB README.md
npm notice 419B package.json
npm notice 764B src/index.js
npm notice Tarball Details
npm notice name: fechas-bitacora-maicol
npm notice version: 1.0.0
npm notice filename: fechas-bitacora-maicol-1.0.0.tgz
npm notice package size: 1.2 kB
npm notice unpacked size: 2.7 kB
npm notice shasum: 09e4867a218d5518a6b1143718898abc5d1e8d62
npm notice integrity: sha512-22HaO1smcM9eN[...]SsxaZ8yN63clw==
npm notice total files: 3
npm notice
npm notice Publishing to https://registry.npmjs.org/ with tag latest and default access (dry-run)
+ fechas-bitacora-maicol@1.0.0
```
Solo se empaquetan los 3 archivos estrictamente necesarios (`README.md`, `package.json`, `src/index.js`), sin incluir `node_modules` ni archivos temporales.

---

## 5. Demostración de enlace simbólico (`npm link`)

Resultado del comando `npm ls` dentro de `bitacora-csi`:
```bash
$ npm ls
bitacora-csi@1.0.0 C:\Users\maico\Documents\Cuarto trimestre\nodejs\bitacora-csi
+-- fechas-bitacora-maicol@1.0.0 extraneous -> .\..\fechas-bitacora-maicol
`-- object-hash@3.0.0
```
Demuestra que `fechas-bitacora-maicol` está enlazado directamente a la carpeta externa `..\fechas-bitacora-maicol`.
