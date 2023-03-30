const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const User = require('../models/users')

passport.use(new LocalStrategy( async (email, password, cb) => {
    try {
        const user = await User.findOne({ email: email })
        if(!await bcrypt.compare(user.password, password)) {
            return cb(null, false, { message: "Passwords do not match." })
        }
        console.log('User found: ' + user);
        return cb(null, user)

    } catch (err) {
        if (err) return cb(err)
    }
}))

passport.serializeUser((user, cb) => {
    process.nextTick(() => {
        cb(null, { id: user.id, email: user.email }) 
    })
})

passport.deserializeUser((user, cb) => {
    process.nextTick(() => {
        return cb(null, user) 
    }) 
})


router.get('/login', (req, res, next) => {
    res.render('login.ejs') 
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login' 
}))

router.get('/register', (req, res, next) => {
    res.render('register.ejs') 
})

router.post('/register', async (req, res, next) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    // console.log('Hashed password is: ' + hashedPassword);
    try {
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword 
        })
        console.log('user successfully created: ' + user)
        req.login(user, (err) => { //logs in to the session, I believe
            if (err) return next(err) 
        })

        res.redirect('/')

    } catch (err) {
        res.send('Error occurred when trying to create user')
        return next(err)
    }

    
     
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err)
        res.redirect('/') 
    })
})

module.exports = router