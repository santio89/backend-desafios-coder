const passport = require("passport");
const express = require("express");
const router = express.Router();
const users = require("../models/usersContainerModel");
const args = require("yargs/yargs")(process.argv.slice(2)).argv;
const os = require("os");


router.use(express.urlencoded({ extended: true }))

const checkAuthentication = (req, res, next) => {
    if (req.isAuthenticated() || req.session.user) {
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

router.get("/logout", (req, res) => {
    const user = req.session.user;
    req.session.destroy((err) => {
        err ? res.json({ status: "logout error", error: err }) : res.json({ status: "ok", user });
        return;
    })
})

router.get("/info", checkAuthentication, (req, res) => {
    const platform = process.platform;
    const version = process.version;
    const memory = process.memoryUsage();
    const path = process.execPath;
    const pid = process.pid;
    const folder = process.cwd();
    const cpus = os.cpus().length;
    
    const objetoInfo = {
        args,
        platform,
        version,
        memory,
        path,
        pid,
        folder,
        cpus
    }
    
    res.json(objetoInfo);
})

/* ruta info con console.log, para test rendimiento */
router.get("/infoconsolelog", checkAuthentication, (req, res) => {
    const platform = process.platform;
    const version = process.version;
    const memory = process.memoryUsage();
    const path = process.execPath;
    const pid = process.pid;
    const folder = process.cwd();
    const cpus = os.cpus().length;
    
    const objetoInfo = {
        args,
        platform,
        version,
        memory,
        path,
        pid,
        folder,
        cpus
    }
    console.log(objetoInfo)
    res.json(objetoInfo);
})

router.post("/login", (req, res) => {
    passport.authenticate('login', (err, user, info) => {
        res.json(info)
    })(req, res)
})

router.post("/register", (req, res) => {
    passport.authenticate('register', (err, user, info) => {
        res.json(info)
    })(req, res)
})


module.exports = { router, users, passport };
