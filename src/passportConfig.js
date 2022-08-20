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
                return done(null, null, { error: true, message: "e-mail ya existe" })
            } else if (!existinguser.error) {
                return done(null, null, { error: true, message: "usuario ya existe" })
            }

            const newUser = {
                email,
                username,
                password: createHash(password)
            }
            users.save(newUser);

            return done(null, null, { status: "ok", message: "Usuario registrado exitosamente" })
        } catch (e) {
            console.log("error en registro: ", e)
            done(null, newUser, { error: true, message: "error en registro" })
        }
    })

    const loginStrategy = new LocalStrategy({ passReqToCallback: true }, async (req, username, password, done) => {
        const { email } = req.body;
        try {
            const user = await users.getByEmail(email)

            if (user.error || !bcrypt.compareSync(password, user.password)) {
                return done(null, null, { error: true, message: "credenciales inválidas" })
            }

            req.session.user = {username: user.username, email: user.email};
            done(null, user, { status: 'ok' })
        } catch (e) {
            console.log("error login: ", e)
            done(null, null, { error: true, message: "error login" })
        }
    })

    passport.use('register', registerStrategy)
    passport.use('login', loginStrategy)

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        const a = users.collection.findById(id, done);
    });
}

module.exports = initialize;