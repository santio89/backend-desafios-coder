/* contenedor principal de productos */
const Contenedor = require("../Contenedor");
const contenedorProductos = new Contenedor("products");
/* cargar algunos productos iniciales */
/* contenedorProductos.save({title: "Trainspotting", price: 20, thumbnail: "https://www.ocimagazine.es/wp-content/uploads/2021/06/trainspotting-cartel.jpg"})
contenedorProductos.save({title: "2001: A Space Odyssey", price: 15, thumbnail: "https://upload.wikimedia.org/wikipedia/en/thumb/1/11/2001_A_Space_Odyssey_%281968%29.png/220px-2001_A_Space_Odyssey_%281968%29.png"})
contenedorProductos.save({title: "Friday de 13th I", price: 12, thumbnail: "https://horrornews.net/wp-content/uploads/2018/11/friday-the-13th-movie-poster-1980.jpg"}) */


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