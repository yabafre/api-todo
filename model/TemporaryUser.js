const mongoose = require("mongoose")
const Schema = mongoose.Schema


let temporaryUser = new Schema(
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
        }, expireAt: {
            type: Date,
            default: Date.now,
            expires: '5m'
          } 
    }
)


const TemporaryUser = mongoose.model("TemporaryUser", temporaryUser)

module.exports = TemporaryUser
