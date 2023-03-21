const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')


const initialize = (passport, getUserByEmail, getUserById) => {
    const authenticateUser = async (email, password, done) => {
        const user = await getUserByEmail(email)
        if (user === null) {
            return done(null, false, { message: 'No user with that email.' })
        }
        
        try {
            if(await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: "Password incorrect." })
            }
        } catch (e) {
            return done(e)
        }

    }

    passport.use(new LocalStrategy( { usernameField: 'email' }, authenticateUser)) //could also pass in password field, but it already defaults to 'password', which is what we are using anyway
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { 
        return done(null, getUserById(id))
    })


}

module.exports = initialize