/* contenedor principal de productos */
const Contenedor = require("../Contenedor");
const productsDatabase = require("../db/database").mysqlConnection;
const contenedorProductos = new Contenedor(productsDatabase, "products");


const getAllProducts = async (req, res)=>{
    res.json(await contenedorProductos.getAll());
}

const getProductById = async (req, res)=>{
    res.json(await contenedorProductos.getById(Number(req.params.id)));
}

const postProduct = async (req, res)=>{
    res.json(await contenedorProductos.save(req.body))
}

const putProduct = async (req, res)=>{
    res.json(await contenedorProductos.saveById(Number(req.params.id), req.body));
}

const deleteProductById = async (req, res)=>{
    res.json(await contenedorProductos.deleteById(Number(req.params.id)));
}

module.exports = {contenedorProductos, getAllProducts, getProductById, postProduct, putProduct, deleteProductById}