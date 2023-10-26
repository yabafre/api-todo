const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config()
const User = require('../model/user')
const TemporaryUser = require('../model/TemporaryUser')
const Mailing = require('../services/Mail');


module.exports = {
    async reset(req, res){
        const {mail} = req.params
        try {
            const remove = await User.findOneAndDelete({'mail': mail})
            return res.send(201)
        } catch (error) {
            console.error('erreur dans le post/reset/: ', error.message)
            let code = 500
            let message = 'Erreur est survenue, veuillez réessayer.'
            return res.status(code).json({
                message,
            })
        }
    },
    //recuperation des champs du nouvel utilisateur
    userAuth(req, res, next){
        const {name, mail} = req.body
        let  {password} = req.body;

        // vérification des champs
        const nameError = !name ? "name," : ""
        const mailError = !mail ? "mail," : ""
        const passwordError = !password ? "password," : ""

        if (!name || !mail || !password){
            return res.status(400).json({
                message: `Il manque des informations : ${nameError} ${mailError} ${passwordError}`
            })
        }
        res.name = name;
        res.mail = mail;
        res.password = password;
        next()
    },
    //création du Token
    creatToken(req, res, next){
        const  token  = crypto.randomUUID()
        // console.log(req.url);
        res.token = token;
        next()
    },
    //inscription de l'utilisateur et envoie de mail de confirmation
    async  signup(req, res){

        const {name , mail, token} = res;
        let {password} = res

        // vérification par regex du mot de passe et du mail
        const verifEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const verifPassword = /^(?=.[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/;

        try {

            if(!verifEmail.test(mail)){
                    return res.json({ message: 'Veuillez saisir un email valide'})
             } else if(!verifPassword.test(password)){
                    return res.json({ message: `${password} n'est pas bon, veuillez entrer un mot de passe avec une majuscule, une minuscule et un chiffre compris entre 8 et 20 caractères`})
             }

            // hash du mot de passe après vérification
            password = bcrypt.hashSync(password,10);

            //Vérification de si utilisateur à déjà reçu un mail de confirmation
            const foundCom = await TemporaryUser.findOne({'mail':mail})
            //Vérification de si utilisateur est déjà inscrit
            const foundUser = await User.findOne({'mail':mail})

            if (foundUser){
                throw new Error('foundUser')
            }
            if (foundCom){
                throw new Error('foundCom')
            }

            //inscription dans la base de donnée en attente de confirmation (5min)
            const newUser = new TemporaryUser({name, mail, password, token})
            const savedUser = await newUser.save()
            console.log( 'controllers/authController.js > savedUser >',savedUser)

            //nouvelle instance de mail
            const eMail = new Mailing;

            // send mail pour confirmation
            const {requestId} = await eMail.sendMail (name,token,mail)

            console.log(requestId);

            return res.status(201).json({
                message:`Un e-mail contenant un lien vous a été envoyé, merci de cliquer sur ce lien pour finaliser votre inscription.`,
                token
            })
        } catch (error) {
            console.error('erreur dans le post/signup: ', error.message)
            let message = 'Error 500'
            let code = 500
            if(error.message === 'foundUser'){
                code = 409
                message = 'cet utilisateur est déjà inscrit'
            }
            if(error.message === 'foundCom'){
                code = 409
                message = 'cet utilisateur à déjà reçu un mail de confirmation '
            }
            return res.status(code).json({
                message,
                })
        }
    },
    //confirmation et inscription de l'utilisateur et envoie de mail de bienvenue
    async confirm(req, res){

        let getToken = req.query.token; // $_GET["token"]
        console.log(getToken);

        try{
            //inscription dans la base de donnée
            const foundComfirm = await TemporaryUser.findOne({'token': req.query.token});
            const foundTrue = await User.findOne({'token': req.query.token});
            
            //verification base de donnée principal
            if(foundTrue){
                throw new Error ('User True')
            }
            
            //verification base de donnée si token existant
            if (foundComfirm === null){
                throw new Error ('Aucun user')
            } 
            
            //recupération base de donnée à partir du token
            const name = foundComfirm.name
            const mail = foundComfirm.mail
            const password = foundComfirm.password
            const token = foundComfirm.token
            
            //inscription dans la base de donnée principale après confirmation
            const newUser = new User({name, mail, password, token})
            const savedUser = await newUser.save()
            console.log( 'controllers/authController.js > savedUser >',savedUser)

            //nouvelle instance de mail
            const eMail = new Mailing;
            // send mail de bienvenue
            const {requestId} = await eMail.mailUser(name,mail)
                
            console.log(requestId);
            
            // delete user confirm
            const deleteTemp = await TemporaryUser.findOneAndDelete({ 'id': foundComfirm.id })

            return res.status(201).json({
                message:'Merci de votre inscription.',
            })
        }catch(error)
        {
            console.error('erreur dans le get/signup/comfirm: ', error)
                if(error.message === 'Aucun user'){
                    code = 409
                    message = 'Utilisateur inconu ou lien expiré.'
                }
                if (error.message === 'User True'){
                    code = 410
                    message = 'Utilisateur déjà confirmé.'
                }
                return res.status(code).json({
                    message,
                    })
        }

    }
}
