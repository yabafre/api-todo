const bcrypt = require('bcryptjs');
require('dotenv').config()
const ACCESS_TOKEN = process.env.ACCESS_TOKEN_SECRET;
const User = require('../model/user')
const Task = require("../model/task");
const Function = require('../services/function');


module.exports = {

    //recuperation des champs utilisateur
    sessionAuth(req, res, next){
            const {mail, password} = req.body
            // vérification des champs
            const mailError = !mail ? "mail," : ""
            const passwordError = !password ? "password," : ""
    
            if (!mail || !password){
                return res.status(400).json({
                    message: `Il manque des informations : ${mailError} ${passwordError}`
                })
            }
            res.mail = mail;
            res.password = password;
            next()
    },
    async sign(req,res){
        const {mail, password} = res;
        try{
            //verification du mail dans la base de donnée
            const foundSign = await User.findOne({'mail': mail});
            
            if(!foundSign){
                throw new Error ('session')
            }
            console.log(foundSign.user);
            //compare password avec la base de donnée & creation de session auth
            const sessionVerif = new Function
            sessionVerif.createJwt(password,foundSign,ACCESS_TOKEN,res)
            
        }catch(error){
            console.error('erreur dans le post/auth/signin/: ', error.message)
            let code = 500
            let message = 'Erreur de connexion, veuillez réessayer.'
            if(error.message === 'session'){
                code = 401
                message = 'Mail incorrect'
            }
            if(error.message === 'connect'){
                code = 409
                message = 'Vous êtes déjà connectez'
            }
            return res.status(code).json({
                message,
            })
        }
    },
    async sessionOpen(req, res) {

        let payload = req.decodeToken;
        
        try {

            //verification du user dans la base de donnée par id
            const foundSign= await User.findOne({'_id': payload.user.id});
            console.log('User Info : ',foundSign);
            if(!foundSign){
                throw new Error('bdd')
            }
            // user à partir du token de session, lister ses taches
            const listTask = await Task.find({'user_id': foundSign._id}).populate('body').sort('-createdAt').select({'__v' : 0});
            console.log('listTask',listTask);
            const foundList =
                res.status(200).json({
                    message: `Bienvenue ${foundSign.name}, Vos taches : `,listTask
                });
        } catch (error) {
            console.error('erreur dans le post/auth/sessionToken/: ', error.message)
            let code = 500
            let message = 'Veuillez réessayer.'
            if(error.message === 'bdd'){
                code = 409
                message = 'Erreur de connexion.'
            }
            return res.status(code).json({
                message,
            })
        }
    },
    async addTask(req, res){

        let payload = req.decodeToken;

        const {body, completed} = req.body;
        const mode = req.params.create;

        try{

            const foundSign= await User.findOne({'_id':payload.user.id});
            console.log('User Info : ',foundSign);
            if(!foundSign){
                throw new Error('bdd')
            }
            //creation de la tache
            if (mode !== 'create'){
                throw new Error('mode')
            }
            if (!body){
                throw new Error('taskOff')
            }
            const data = {
                body: body,
                user_id: foundSign._id,
                completed: completed ? completed : false
            };
            console.log('data',data)
            const newTask = new Task(data);
            await newTask.save();
            console.log('newTask',newTask);
            return res.status(201).json({
                message: `Votre tache a bien été créé : ${foundSign.name}`,
                task : newTask
            } );

        } catch (error) {
            console.error('erreur dans le post/addTask/: ', error.message)
            let code = 500
            let message = 'Veuillez réessayer.'
            if(error.message === 'bdd'){
                code = 409
                message = 'Erreur de connexion.'
            }
            if(error.message === 'mode'){
                code = 409
                message = 'Mode non identifié'
            }
            if(error.message === 'taskOff'){
                code = 409
                message = 'Veuillez ajouter une tache'
            }
            return res.status(code).json({
                message,
            })
        }
    },
    async updateTask(req, res){

        let payload = req.decodeToken;
        const id = req.params.id;
        const {body, completed} = req.body;
        const mode = req.params.update;

        try{

            const foundSign= await User.findOne({'_id': payload.user.id});
            console.log('User Info : ',foundSign);
            if(!foundSign){
                throw new Error('bdd')
            }
            if (mode !== 'update'){
                throw new Error('mode')
            }
            if (!body){
                throw new Error('taskOff')
            }
            const data = {
                body: body,
                user_id: foundSign._id,
                completed: completed ? completed : false
            };
            const updateTask = await Task.findByIdAndUpdate(id, data, {new: true});
            console.log('updateTask',updateTask);
            return res.status(200).json({
                message: `Votre tache a bien été modifié : ${foundSign.name}`,
            } );

        } catch (error) {
            console.error('erreur dans le post/auth/updateTask/: ', error.message)
            let code = 500
            let message = 'Veuillez réessayer.'
            if(error.message === 'bdd'){
                code = 409
                message = 'Erreur de connexion.'
            }
            if(error.message === 'mode'){
                code = 409
                message = 'Mode non identifié'
            }
            if(error.message === 'taskOff'){
                code = 409
                message = 'Veuillez ajouter une tache'
            }
            return res.status(code).json({
                message,
            })
        }
    },
    async deleteTask(req, res){

        let payload = req.decodeToken;
        const id = req.params.id;
        const mode = req.params.delete;

        try{

            const foundSign= await User.findOne({'_id': payload.user.id});
            console.log('User Info delete : ',foundSign);
            if(!foundSign){
                throw new Error('bdd')
            }
            if (mode !== 'delete'){
                throw new Error('mode')
            }
            const deleteTask = await Task.findByIdAndDelete(id);
            console.log('deleteTask',deleteTask);
            return res.status(200).json({
                message: `Votre tache a bien été supprimé : ${foundSign.name}`,
            } );

        } catch (error) {
            console.error('erreur dans le post/auth/deleteTask/: ', error.message)
            let code = 500
            let message = 'Veuillez réessayer.'
            if(error.message === 'bdd'){
                code = 409
                message = 'Erreur de connexion.'
            }
            if(error.message === 'mode'){
                code = 409
                message = 'Mode non identifié'
            }
            return res.status(code).json({
                message,
            })
        }
    }
}
