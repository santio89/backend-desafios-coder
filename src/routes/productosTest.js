const express = require("express");
const faker = require("@faker-js/faker").faker

const router = express.Router();
faker.locale = "es"

/* ruteo */
router.route("/").get((req, res)=>{
    let productos = [];

    for (i=0; i<5; i++){
        let producto = {};
        producto.title = faker.commerce.productName();
        producto.imgUrl = faker.image.image();
        producto.price = faker.commerce.price();
        productos.push(producto)
    }

    res.json(productos);
})


module.exports = {router};