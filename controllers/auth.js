const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
// const bcrypt = require('bcrypt')
const User = require('../models/users')

const strategy = new LocalStrategy(User.authenticate())

// A more custom strategy I was trying to implement before deciding to try passport-local-mongoose again
// const possibleCustomStrategy = new LocalStrategy( async (email, password, cb) => {
//     try {
//         const user = await User.findOne({ email: email })
//         if(!user) { 
//             console.log('USER NOT FOUND');
//             return cb(null, false, { message: 'User not found.'})
//         }
//         if(!await bcrypt.compare(user.password, password)) {
//             console.log('bcrypt compare failed');
//             return cb(null, false, { message: "Invalid password." })
//         }
//         console.log('User found and passwords matched: ' + user);
//         return cb(null, user)

//     } catch (err) {
//         if (err) return cb(err)
//     }
// })

passport.use(strategy)

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

router.get('/', (req, res) => {
    const user = req.user || null
    const sessionID = req.sessionID || "No sessionID found"
    res.render('index.ejs', { user: user, sessionID: sessionID }) 
})

router.get('/login', (req, res, next) => {
    res.render('login.ejs') 
})

router.post('/login', 
    passport.authenticate('local', {
        failureRedirect: '/login-failure',
        successRedirect: '/secret'
    }), (err, req, res, next) => {
        console.log(req.user);
        if(err) next(err)
    }
)

router.get('/login-failure', (req, res, next) => {
    console.log(req.session);
    res.render('login-failure.ejs') 
})

router.get('/secret', (req, res, next) => {
    if(!req.user) return next()
    console.log( req.session, req.user );
    res.render('secret.ejs', { user: req.user, sessionID: req.sessionID }) 
})

router.get('/profile', (req, res) => {
    console.log(req.session);
    if (req.isAuthenticated()) {
        res.json({ message: 'You made it to the profile page'})
    } else {
        res.json({ message: 'You are not authenticated' })
    }
})

// router.post('/login', (req, res) => {
//     req.session.email = req.body.email
//     res.send(`Hello ${req.session.email}. Your session ID is ${req.sessionID} and your session expires in ${req.session.cookie.maxAge} milliseconds.`) 
// })

router.get('/register', (req, res, next) => {
    res.render('register.ejs') 
})

//BELOW CODE WAS WHERE I LEFT REGISTER POST ROUTE BEFORE MOVING BACK TO USING PASSPORT-LOCAL-MONGOOSE
// router.post('/register', async (req, res, next) => {
//     const salt = await bcrypt.genSalt(10)
//     const hashedPassword = await bcrypt.hash(req.body.password, salt)
//     // console.log('Hashed password is: ' + hashedPassword);
//     try {
//         const user = await User.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: hashedPassword,
//         })
//         console.log('user successfully created: ' + user)
//         req.login(user, (err) => { //logs the user into the session, I believe
//             if (err) return next(err) 
//         })

//         res.redirect('/')

//     } catch (err) {
//         res.send('Error occurred when trying to create user')
//         return next(err)
//     }
// })

router.post('/register', (req, res) => {
    User.register(
        new User({
            username: req.body.username, 
        }), req.body.password, (err, msg) => {
            if(err) {
                res.send(err)
            } else {
                console.log("Successful registration");
                res.redirect('/login')
            }
        }
    ) 
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) {
            console.log(err.message);
            return next(err)
        }
    })
    res.redirect('/') 
})

module.exports = router