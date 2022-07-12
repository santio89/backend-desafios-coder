const express = require("express");
const router = express.Router();
const {upload, getAllProducts, getProductById, postProduct, putProduct, deleteProductById, formSent} = require("../controllers/apiController");;

/* ruteo */
router.get("/", getAllProducts)
router.get("/:id", getProductById)
router.post("/", postProduct)
router.post("/upload", upload.single("imgFile"), formSent)
router.put("/:id", putProduct)
router.delete("/:id", deleteProductById)


module.exports = {router};