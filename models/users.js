const mongoose = require('mongoose')
const Schema = mongoose.Schema
// const bcrypt = require('bcrypt') // not needed with Passport Local Mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    username: { type: String, required: true }
    // password: { type: String, required: true } //not needed when using passport-local-mongoose
})

userSchema.plugin(passportLocalMongoose);


// BELOW CODE NOT USED WHEN USING TO PASSPORT-LOCAL-MONGOOSE USAGE
// userSchema.pre('save', { document: true, query: false}, async function(next) {
//     try {
//         // check method of registration
//         const user = this
//         if(!user.isModified('password')) return next()
//         // generate salt
//         const salt = await bcrypt.genSalt(10)
//         // hash the password
//         const hashedPassword = await bcrypt.hash(this.password, salt)
//         // replace plain text password with the hashed password
//         this.password = hashedPassword
//         next()
//     } catch (error) {
//         return next(error)
//     }
// })

// userSchema.methods.matchPassword = async function (password) {
//     try {
//         return await bcrypt.compare(password, this.password)
//     } catch (error) {
//         throw new Error(error)
//     }
// }


const User = mongoose.model('User', userSchema)

module.exports = User
