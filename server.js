// DEPENDENCIES
require("dotenv").config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy

const authRouter = require('./controllers/auth')

//DATABASE SETUP
const db = mongoose.connection
//if this were a deployed app, there would be a .env value for a Mongo Atlas connection string
//but since this is just practice, the localhost variant is fine
const mongoLOC = 'mongodb://localhost:27017/'+'auth_practice'

// VALUES FROM OTHER FILES
const PORT = process.env.PORT
const User = require('./models/users')

// MIDDLEWARE
app.set('view-engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // should we resave session variables if nothing has changed?
    saveUninitialized: false // want to save an empty value in the session if there is no value?
}))
app.use(passport.initialize()) // sets up some basics of passport
app.use(passport.session()) // since we want to store our variables to be persisted across entire session, works with app.use(session) above.

app.use('/', authRouter)

//PASSPORT CONFIG
// passport.use(); //FIX THIS

// passport.serializeUser(User.serializeUser())
// passport.deserializeUser(User.deserializeUser())



//ROUTES
app.get('/', (req, res) => {
    const user = req.user || "No user found"
    res.render('index.ejs', { user: user}) 
})

// app.get('/login', (req, res) => {
//     res.render('login.ejs', {
//         user: req.user, message: req.flash('error') // i think this handles situation where user already logged in?
//     }) 
// })

// app.post('/login', /* pass in proper email and password values here, followed by a function which generates the appropriate response */ passport.authenticate('local', {
//     successRedirect: '/',
//     failureRedirect: '/login', 
//     failureFlash: true // displays error messages noted in passport-config.js
// }))

// app.get('/register', (req, res) => {
//     res.render('register.ejs') 
// })

// app.post('/register', async (req, res) => {
//     // ensure approved credentials
//     // if user already exists, throw err
//     // create new user
//     const user = await User.create({name: req.body.name, email: req.body.email, password: req.body.password})

//     res.json(user)
// }) 

// app.get('/logout', (req, res, next) => {
//     console.log('logout route activated');
//     req.logout( (err) => {
//         if (err) return next(err)
//         req.flash('success_msg', 'session terminated')
//         res.redirect('/') 
//     })
// })

// DB CHECKS
db.on('error', e => console.log(e.message + ' ERROR is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoLOC));
db.on('disconnected', () => console.log('mongo disconnected'));

const connectToDB = async () => {
    await mongoose.connect(mongoLOC)
    console.log('The connection with mongo is established');
}
connectToDB()

const getTestUser = async () => {
    const user = await User.findOne({email: 'NathanLFreeman@gmail.com'})
}

// SERVER LISTENER
app.listen(PORT, () => {
    console.log('Express is listening on ' + PORT); 
})