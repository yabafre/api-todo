
require('dotenv').config()
const port = process.env.PORT || 3000
const {API_KEY} = process.env;
const {CourierClient} = require ('@trycourier/courier');
const courier = CourierClient({ authorizationToken: `${API_KEY}` });

class Mail{
/**
 * 
 * @param {string} user 
 * @param {string} token 
 * @param {string} mail 
 * @returns 
 */
    sendMail(user, token, mail) {
        courier.send({
            message: {
                data: {
                    name: `${user}`,
                    link: `http://localhost:${port}/auth/signup/confirm?token=${token}`
                },
                content: {
                    title: "Inscription to Api-resa",
                    body: `Salut {{name}} tu y es presque, confirme ton inscription en cliquant ici :  {{link}}`,
                },
                to: {
                    email: `${mail}`
                }
            },
        });
        return courier.send
    }
    mailUser(user, mail) {
        courier.send({
            message: {
                data: {
                    name: `${user}`,
                },
                content: {
                    title: "Welcome",
                    body: `Bienvenue {{name}} nous sommes ravis de te compter parmis nous !`,
                },
                to: {
                    email: `${mail}`
                }
            },
        });
        return courier.send
    }
}

module.exports = Mail