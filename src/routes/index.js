const bcrypt = require("bcrypt")
const passport = require("passport")
const express = require("express");
const UserContainer = require("../Users")
const router = express.Router();


const users = new UserContainer("users", {
    email: { type: String, required: true},
    username: { type: String, required: true },
    password: { type: String, required: true }
});

router.use(express.urlencoded({ extended: true }))

/* ruteo */
router.get("/logged", (req, res) => {
    if (req.session.user) {
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

router.get("/datos", (req, res) => {
    if (req.session.user){
        if (req.session.contador) {
            req.session.contador++;
            return res.json({
                visitas: req.session.contador,
                user: req.session.user
            })
        } else {
            req.session.contador = 1;
            res.json({visitas: req.session.contador, user: req.session.user})
        }
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await users.getByEmail(email)
    
    if (user.error || user.password != password){
        return res.json({ error: true, message: "Invalid credentials" });
    }

    req.session.user = user;
    res.json({ status: 'ok', user: user })
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
 

    if (!existingemail.error){
        return res.json({error: true, message: "email already exists"})
    } else if (!existinguser.error){
        return res.json({error: true, message: "user already exists"})
    }
    
    await users.save(req.body)
    res.json({status: "ok", message: "user registered successfully"})
})


module.exports = {router};
