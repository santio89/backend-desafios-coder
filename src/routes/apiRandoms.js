const express = require("express");
const router = express.Router();
const {fork} = require("child_process");

/* ruteo */
router.get("/", (req, res)=>{
    const calc = fork("./src/utils/calcRandoms.js");

    let cant = req.query.cant;
    if (isNaN(cant)){
        cant = 1000000;
    }

    calc.send(cant);
    calc.on('message', numbers=>{
        res.json(numbers);
    })
})


module.exports = {router};