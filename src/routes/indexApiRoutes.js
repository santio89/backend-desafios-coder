const express = require("express");
const router = express.Router();
const {getAllProducts, getProductById, postProduct, putProduct, deleteProductById} = require("../controllers/apiController");;

/* ruteo */
router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.post("/", postProduct)
router.put("/:id", putProduct)
router.delete("/:id", deleteProductById)


module.exports = {router};