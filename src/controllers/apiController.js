/* contenedor principal de productos */
const Contenedor = require("../Contenedor");
const productsDatabase = require("../db/database").mysqlConnection;
const contenedorProductos = new Contenedor(productsDatabase, "products");

const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "public/uploads")
    },
    filename: function (req, file, cb){
        file.date = Date.now();
        cb(null, file.date + "-" + file.originalname )
    }
})
const upload = multer({storage: storage})


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

const formSent = async (req, res)=>{
    const img = req.body.formImage
    
    if (img == "file" && req.file){
        req.body.thumbnail = `/uploads/${req.file.date}-${req.file.originalname}`
    } 
    await contenedorProductos.save(req.body)
    res.redirect("/")
}

module.exports = {upload, contenedorProductos, getAllProducts, getProductById, postProduct, putProduct, deleteProductById, formSent}