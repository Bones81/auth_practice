const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
})

const options = { usernameField: "email", usernameCaseInsensitive: true }
userSchema.plugin(passportLocalMongoose, options)

const User = mongoose.model('User', userSchema)

module.exports = User
