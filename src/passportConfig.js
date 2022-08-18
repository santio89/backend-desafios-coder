const bcrypt = require("bcrypt")
const LocalStrategy = require("passport-local").Strategy
const users = require("./models/usersContainerModel")

function initialize(passport) {
    const createHash = (pass) => bcrypt.hashSync(pass, bcrypt.genSaltSync(10));

    const registerStrategy = new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
        const { email } = req.body;

        try {
            const existingemail = await users.getByEmail(email)
            const existinguser = await users.getByUsername(username)

            if (!existingemail.error) {
                return done("email already exists", null)

         /*        return res.json({ error: true, message: "email already exists" }) */
            } else if (!existinguser.error) {
                return done("user already exists", null)

              /*   return res.json({ error: true, message: "user already exists" }) */
            }

            const newUser = {
                email,
                username,
                password: createHash(password)
            }

            const createdUser = await users.save(newUser)
            return done(null, createdUser)
           /*  res.json({ status: "ok", message: "user registered successfully" }) */
        } catch(e){
            console.log("error en registro: ",e)
            done("error en registro", null)
        }
    })

    const loginStrategy = new LocalStrategy({passReqToCallback: true}, async (req, username, password, done)=>{
        const { email } = req.body;

        try{
            const user = await users.getByEmail(email)
        
            if (user.error || !bcrypt.compareSync(password, user.password)){
                return done("Invalid credentials", null)
    
                /* return res.json({ error: true, message: "Invalid credentials" }); */
            }
            

            return done(null, user)
      /*       res.json({ status: 'ok', user: user }) */
        } catch(e){
            console.log("error login")
            done("error login: ",e)
        }
      
    })

    passport.use('register', registerStrategy)
    passport.use('login', loginStrategy)

    passport.serializeUser((user, done) => done(null, user._id))

    passport.deserializeUser(async (id, done) => {
        try{
            const user = await users.getById(id)
            if (user.error){
                return done("error deserializando user", null)
            }
            return done(null, user);
        } catch(e){
            console.log("error deserializando user")
            return done("error deserializando user", null)
        }
    })
}

module.exports = initialize;