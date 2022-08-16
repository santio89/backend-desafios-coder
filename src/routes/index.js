const bcrypt = require("bcrypt")
const passport = require("passport")
const express = require("express");
const UserContainer = require("../Users")
const router = express.Router();


const users = new UserContainer("users", {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
});


/* ruteo */
router.get("/logged", (req, res) => {
    if (req.session.admin === true) {
        res.json({ status: "ok", user: req.session.user })
    } else {
        res.status(401).json({ status: 401, code: "no credentials" })
    }
/*     if (req.isAuthenticated()){
        res.json({ status: "ok", user: req.session.user })
    } else{
        res.status(401).json({ status: 401, code: "no credentials" })
    } */
})

router.get("/session-test", (req, res) => {
    if (req.session.contador) {
        req.session.contador++;
        return res.send("visitas: " + req.session.contador)
    } else {
        req.session.contador = 1;
        res.send("esta es tu primera visita")
    }
})

router.get("/login", (req, res) => {
    const { username } = req.query;
    req.session.user = username;
    req.session.admin = true;

    res.json({ status: 'ok', user: req.session.user })
})

router.get("/logout", (req, res) => {
    const user = req.session.user;
    req.session.destroy(err => {
        if (err) {
            res.status(500).json({ status: "error", body: err })
        } else {
            res.json({ status: "ok", user })
        }
    })
})

router.post("/register", async (req, res)=>{
    const {username, email} = req.body;
    const existingemail = await users.getByEmail(email)
    const existinguser = await users.getByUsername(username)

    if (existingemail.error){
        return res.json({error: true, message: "email already registered"})
    } else if (existinguser.error){
        return res.json({error: true, message: "user already registered"})
    }
    
    await users.save( req,body)
    res.json({status: "ok", message: "user registered successfully"})
})


module.exports = {router};
