const bcrypt = require("bcrypt")

const LocalStrategy = require("passport-local").Strategy

function initialize (passport){
    const authenticateUser = async (username, password, done)=>{
        /* get user first */

        if (user == null){
            return done(null, false, {message: 'wrong credentials'})
        }

        try{
            if (await bcrypt.compare(password, user.password)){
                return done(null, user)
            } else{
                return done(null, false, {message: 'wrong credentials'})
            }
        } catch(e){
            return done(e)
        }
    }

    passport.use(new LocalStrategy('login', authenticateUser))

    passport.serializeUser((user, done)=>done(null, user.id)
    )

    passport.deserializeUser((id, done)=>{
        done(null, user)
    })
}

module.exports = initialize;