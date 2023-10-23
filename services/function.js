const bcrypt = require('bcryptjs');
const timExp = '1h'
const exCook = 60 * 1000
const jwt = require('jsonwebtoken');

class Function{

    createJwt(resPassword, bddAuth, SECRET, res){
        bcrypt.compare(resPassword, bddAuth.password, function(err, value) {
            if (!value){
                console.log(value); 
                    return res.status(401).json({ message: "Mot de passe invalide" })
            }
            //Payload data
            const auth = {
                name : bddAuth.name,
                id: bddAuth._id,
            };
            const token = jwt.sign({ user: auth },SECRET, {algorithm: "HS256", expiresIn: timExp });
            //token session
            // res.header('Authorization',token);
            res.status(200).json({
                message: `Jwtoken- for : ${bddAuth.name}`,token})
        });
    }
    verifyJWT(token, key) {
        let valid = false;
        try {
            const decoded = jwt.verify(token, key);
            valid = decoded;
        } catch (err) {
            console.log(err);
        }
        return valid;
    }
}
    
module.exports = Function