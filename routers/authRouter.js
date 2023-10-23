const express = require('express')
const {signup, creatToken, userAuth, confirm} = require ('../controllers/authControllers');
const {sessionAuth, sign} = require ('../controllers/sessionControllers');

exports.router = (() =>{

    const authRouter = express.Router()

    authRouter.route('/signup/').post(userAuth,creatToken,signup)
    authRouter.route('/signup/confirm').get(confirm)
    authRouter.route('/signin').post(sessionAuth,sign)
    return authRouter
})()