const passport = require("passport");
const express = require("express");
const router = express.Router();
const users = require("../models/usersContainerModel");


router.use(express.urlencoded({ extended: true }))

const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated() || req.session.user ) {
        next()
    } else {
        res.status(401).json({ status: 401, code: "no credentials" })
    }
}

/* ruteo */
router.get("/logged", checkAuthentication, (req, res) => {
    res.json({ status: "ok", user: req.session.user })
})

router.get("/datos", checkAuthentication, (req, res) => {
    if (req.session.contador) {
        req.session.contador++;
        res.json({
            visitas: req.session.contador,
            user: req.session.user
        })
    } else {
        req.session.contador = 1;
        res.json({ visitas: req.session.contador, user: req.session.user })
    }

})

router.post("/login", (req, res) => {
    passport.authenticate('login', (err, user, info)=>{
        res.json(info)
    })(req, res)
})

router.get("/logout", (req, res) => {
    const user = req.session.user; 
    req.session.destroy((err)=>{
        err?res.json({status: "logout error", error: err}):res.json({ status: "ok", user });
        return;
     })
})

router.post("/register", (req, res) => {
    passport.authenticate('register', (err, user, info)=>{
        res.json(info)
    })(req, res)
})


module.exports = { router, users, passport };
