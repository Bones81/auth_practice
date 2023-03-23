// DEPENDENCIES
if (process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}
const express = require('express')
const app = express()
const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')
const crypto = require('crypto')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')


//DATABASE SETUP
const db = mongoose.connection
//if this were a deployed app, there would be a .env value for a Mongo Atlas connection string
//but since this is just practice, the localhost variant is fine
const mongoLOC = 'mongodb://localhost:27017/'+'auth_practice'

// VALUES FROM OTHER FILES
const PORT = process.env.PORT
const User = require('./models/users')
// const initializePassport = require('./passport-config')
// initializePassport(
//     passport, 
//     async (email) => { 
//         const user = await User.findOne({ email: email })
//         console.log('User found: ' + user.name, user.email);
//         return user
//     },
//     async (id) => {
//         const user = await User.findById(id)
//         console.log('User found by id: ' + user);
//         return user
//     }
    
// )

//PASSPORT CONFIG
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


// MIDDLEWARE
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // should we resave session variables if nothing has changed?
    saveUninitialized: false // want to save an empty value in the session if there is no value?
}))
app.use(passport.initialize()) // sets up some basics of passport
app.use(passport.session()) // since we want to store our variables to be persisted across entire session, works with app.use(session) above.



//ROUTES
app.get('/', (req, res) => {
    res.render('index.ejs', { name: 'User name should go here.'}) 
})

app.get('/login', (req, res) => {
    res.render('login.ejs') 
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login', 
    failureFlash: true // displays error messages noted in passport-config.js
}))

app.get('/register', (req, res) => {
    res.render('register.ejs') 
})

app.post('/register', async (req, res) => {
    try {
        const hashedPW = await bcrypt.hash(req.body.password, 10)
        const user = {
            name: req.body.name,
            email: req.body.email,
            password: hashedPW
        }
        const createdUser = await User.create(user)
        if(createdUser) {
            console.log('User created: ' + createdUser);
        } else {
            console.log('Error creating user');
        }
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }

})

app.get('/logout', )

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