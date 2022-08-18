const passport = require("passport")
const express = require("express");
const router = express.Router();
const initializePassportConfig = require("../passportConfig")
const users = require("../models/usersContainerModel");

initializePassportConfig(passport)

router.use(express.urlencoded({ extended: true }))

const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.status(401).json({ status: 401, code: "no credentials" })
    }
}

/* ruteo */
router.get("/logged", checkAuthentication, (req, res) => {
    res.json({ status: "ok", user: req.user })
})

router.get("/datos", checkAuthentication, (req, res) => {
    if (req.session.contador) {
        req.session.contador++;
        res.json({
            visitas: req.session.contador,
            user: req.user
        })
    } else {
        req.session.contador = 1;
        res.json({ visitas: req.session.contador, user: req.user })
    }

})

router.post("/login", passport.authenticate('login'), (req, res) => {
    if (req.user) {
        res.json({ status: 'ok', user: req.user })
    } else {
        res.json({ error: true, message: "Invalid credentials" });
    }
})

router.get("/logout", (req, res) => {
    const user = req.user;
    req.logout((err)=>{
        if (err){
            res.json({status: "error", error: err})
        }
    });
    res.json({ status: "ok", user })
})

router.post("/register", passport.authenticate('register'), (req, res) => {
    if (req.user){
        res.json({ status: "ok", message: "user registered successfully" })
    } else{
        res.json({error: true, message: "user or email already exists"})
    }
})


module.exports = { router, users };
