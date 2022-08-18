const Contenedor = require("../Contenedores/Contenedor");
const productsDatabase = require("../db/database").mysqlConnection;
const contenedorProductos = new Contenedor(productsDatabase, "products");

module.exports = contenedorProductos;