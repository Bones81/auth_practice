require("dotenv").config()

const express = require('express')
const app = express()
const PORT = process.env.PORT
const bcrypt = require('bcrypt')

app.set('view-engine', 'ejs')


app.get('/', (req, res) => {
    res.render('index.ejs', { name: "Nathan"}) 
})

app.get('/login', (req, res) => {
    res.render('login.ejs') 
})

app.get('/register', (req, res) => {
    res.render('register.ejs') 
})

app.post('/register', (req, res) => {
     
})


app.listen(PORT, () => {
    console.log('Express is listening on ' + PORT); 
})