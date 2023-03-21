// DEPENDENCIES
require("dotenv").config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
app.use(express.urlencoded({ extended: false }))

//ROUTES
app.get('/', (req, res) => {
    res.render('index.ejs', { name: "Nathan"}) 
})

app.get('/login', (req, res) => {
    res.render('login.ejs') 
})

app.post('/login', (req, res) => {
    
})

app.get('/register', (req, res) => {
    res.render('register.ejs') 
})

app.post('/register', (req, res) => {
     
})

// DB CHECKS
db.on('error', e => console.log(e.message + ' ERROR is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoLOC));
db.on('disconnected', () => console.log('mongo disconnected'));

const connectToDB = async () => {
    await mongoose.connect(mongoLOC)
    console.log('The connection with mongo is established');
}
connectToDB()

// SERVER LISTENER
app.listen(PORT, () => {
    console.log('Express is listening on ' + PORT); 
})