const express = require('express')
const router = express.Router()
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt')
const User = require('../models/users')


router.get('/login', (req, res, next) => {
    res.render('login.ejs', {
        user: "I think this will eventually be 'req.user'"
    }) 
})

router.post('/login', (req, res, next) => {
    res.send("Login form submitted") 
})

router.get('/register', (req, res, next) => {
    res.render('register.ejs') 
})

router.post('/register', async (req, res, next) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    console.log('Hashed password is: ' + hashedPassword);

    res.send("Registration info submitted")
     
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if(err) return next(err)
        res.send("logout commenced") 
    })
})

module.exports = router