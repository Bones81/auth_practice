require("dotenv").config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const db = mongoose.connection

const mongoLOC = 'mongodb://localhost:27017/'+'auth_practice'


const PORT = process.env.PORT
const bcrypt = require('bcrypt')

const User = require('./models/users')

app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended: false }))


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


db.on('error', e => console.log(e.message + ' ERROR is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoLOC));
db.on('disconnected', () => console.log('mongo disconnected'));

const connectToDB = async () => {
    const connection = await mongoose.connect(mongoLOC)
    console.log('The connection with mongo is established');
}
connectToDB()

app.listen(PORT, () => {
    console.log('Express is listening on ' + PORT); 
})