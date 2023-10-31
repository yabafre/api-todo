// middlewares to verify token

require('dotenv').config()
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET;
const jwt = require('jsonwebtoken');
const Function = require('../services/function');


module.exports = {
    sessionVerify: (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: "Vous n'êtes pas connecté" })
        }
        const tokenCheck = new Function;
        const decodeToken = tokenCheck.verifyJWT(token, ACCESS_TOKEN);
        if (!decodeToken) {
            return res.status(401).json({ message: "Token non identifié" })
        }
        console.log(decodeToken)
        req.decodeToken = decodeToken;
        next()
    }
}

