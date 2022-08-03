const normalize = require("normalizr").normalize
const schema = require("normalizr").schema
const denormalize = require("normalizr").denormalize
const util = require("util")



function print(obj) {
    console.log(util.inspect(obj, false, 12, true));
}

function normalizeMensajes(array) {
    const objToNormalize = {
        id: 1,
        mensajes: array
    }

    const authorSchema = new schema.Entity("author")
    const mensajeSchema = new schema.Entity("mensaje", { author: authorSchema }, { idAttribute: "_id" })
    const arrayMensajeSchema = new schema.Entity("mensajes", { mensajes: [mensajeSchema] })


    const normalizedMensajes = normalize(objToNormalize, arrayMensajeSchema)
/*     print(normalizedMensajes) */


    const normalMensajes = denormalize(normalizedMensajes.result, arrayMensajeSchema, normalizedMensajes.entities)
    print(normalMensajes)
    return array;
}

module.exports = normalizeMensajes;

