const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('./models/users')


const initialize = (passport, getNameByEmail, getEmailById) => {
    const authenticateUser = async (name, email, password, done) => {
        try {
            // check if user exists
            const userExists = await User.findOne({ email: email })
            if(userExists) {
                return done(null, false)
            }
            // Create a new user with the user data provided
            const user = await User.create( { name, email, password })
            return done(null, user)
        } catch (error) {
            done(error)
        }
    }
    
    const matchPassword = async (email, password, done) => {
        try {
            const user = await User.findOne({ email: email })
            if(!user) return done(null, false)
            const isMatch = await user.matchPassword(password)
            if (!isMatch) return done(null, false)
            // if passwords match, return user
            return done(null, user)
        } catch (error) {
            console.log(error);
            return done(error, false)
        }
    }

    // I AM LOST; WHERE does authenticateUser get its arguments from?????
    passport.use('local-signup', new LocalStrategy( { usernameField: 'email', passwordField: 'password' }, authenticateUser)) //could also pass in password field, but it already defaults to 'password', which is what we are using anyway
    
    passport.use('local-login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, matchPassword))

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { 
        return done(null, getUserById(id))
    })


}

module.exports = initialize