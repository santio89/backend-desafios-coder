const normalize = require("normalizr").normalize
const schema = require("normalizr").schema
const util = require("util")


function print(obj) {
  console.log(util.inspect(obj, false, 12, true));
}

function normalizeMensajes(mensajes) {
  const author = new schema.Entity("author");

  const mensaje = new schema.Entity(
    "mensaje",
    { author: author },
    { idAttribute: "_id" }
  );

  const schemaMensajes = new schema.Entity(
    "mensajes",
    {
      mensajes: [mensaje],
    }
  );

  const normalizedPost = normalize(
    { id: "mensajes", mensajes },
    schemaMensajes
  );

/*   print(normalizedPost) */

  return normalizedPost;
}

module.exports = normalizeMensajes;

