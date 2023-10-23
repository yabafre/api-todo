const mongoose = require("mongoose")
const Schema = mongoose.Schema


let taskSchema = new Schema(
    {
        user_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
            default: null
        },
        body:{
            type: String,
            unique: false,
            required: true
        },
        completed:{
            type: Boolean,
            unique: false,
            required: true,
        },
    },
    { timestamps: true },
)

const Task = mongoose.model("Task", taskSchema)

module.exports = Task
