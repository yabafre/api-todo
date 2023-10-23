const mongoose = require("mongoose")
const Schema = mongoose.Schema


let userSchema = new Schema(
    {
        name:{
            type: String,
            unique: false,
            required: true
        },
        mail:{
            type: String,
            unique: true,
            required: true
        },
        password:{
            type: String,
            unique: false,
            required: true
        },
        token:{
            type: String,
            unique: true,
            required: true
        },
    }
)

const User = mongoose.model("User", userSchema)

module.exports = User
