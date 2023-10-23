const express = require('express')
const {sessionOpen, addTask, updateTask, deleteTask} = require ('../controllers/sessionControllers');
const {sessionVerify} = require ('../middleware/authVerif');

exports.router = (() =>{
    const userRouter = express.Router()
    userRouter.use(sessionVerify)
    userRouter.route('/').get(sessionOpen)
    // routes prefix by /task
    const task = express.Router()
    task.route('/:create').post(addTask)
    task.route('/:update/:id').put(updateTask)
    task.route('/:delete/:id').delete(deleteTask)
    userRouter.use('/task', task)
    return userRouter
})()