const args = process.argv.slice(2)
const notas = require("./notas.js")

function sistema(){
    if (args[0] == "agregar"){
        agregarTexto(args[1])
    }
    else if(args[0] == "listar"){
        listarNotas(args[1])
    }
    else if(args[0] == "buscar"){
        buscarPalabra(args[1])
    }
    else if (args[0] == "borrar"){
        borrarId(args[1])
    }
    else{
        ayudarUsuario(args[1])
    }
}

function agregarTexto(texto,etiqueta="general"){
    if(typeof texto == "string"){
        notas.agregar(texto,etiqueta)
        return
    }
    return
}
function listarNotas(nota){
    if (typeof nota == "number" && nota > 0){
        let resultado = notas.listar(nota)
        console.log("Las notaas son ",resultado)
    }
    return
}
function buscarPalabra(texto){
    if(typeof texto == "string"){
        notas.buscar(texto)
        return
    }
    return
}
function borrarId(id){
    if(typeof id == "number"){
        notas.borrar(id)
        return
    }
    return
}
function ayudarUsuario(){
    console.log('Los comandos disponibles son los siguientes\n agregar "texto" <etiqueta>\nlistar N \nbuscar <palabra> \nborrar <id>\nayuda')
}