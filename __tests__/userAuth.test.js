// __test__/userAuth.test.js

require('dotenv').config();
const port = process.env.PORT || 3000;
const axios = require('axios');
const User = require('../model/user');


describe('Auth Routes', () => {

    let token;

    beforeAll(async () => {
        try {
            // Supprimez l'utilisateur de test avant de commencer les tests.
            const mail = "testing1@gmail.com"
            const response = await axios.post(`http://localhost:${port}/auth/reset/${mail}`);
            expect(response.status).toBe(200);
        } catch (error) {
            expect(error.response.status).toBe(404);
        }
    });

    it('should create a new user and return a token', async () => {
        try {
            const response = await axios.post(`http://localhost:${port}/auth/signup`, {
                name: "Testing1",
                mail: "testing1@gmail.com",
                password: "Arancar584K",
            });
            expect(response.status).toBe(201);
            token = response.data.token;
            expect(token).toBeDefined();
        } catch (error) {
            console.error(error.response.status);
        }
    });

    it('should confirm the user signup using the token', async () => {
        try {
            if (!token) throw new Error("Token is not defined. Previous test might have failed.");

            const response = await axios.get(`http://localhost:${port}/auth/signup/confirm?token=${token}`);
            expect(response.status).toBe(201);
        } catch (error) {
            console.error(error.response.status);
        }
    });

    // Échec de la confirmation de l'inscription à cause d'un mauvais token
    it('should return 401 for wrong token', async () => {
        try {
            await axios.get(`http://localhost:${port}/auth/signup/confirm?token=wrongToken`);
        } catch (error) {
            expect(error.response.status).toBe(409);
        }
    });

    // Échec de l'inscription à cause d'un email déjà enregistré
    it('should return 409 for registered email', async () => {
        try {
            await axios.post(`http://localhost:${port}/auth/signup`, {
                name: "Testing1",
                mail: "testing1@gmail.com",
                password: "Arancar584K",
            });
        } catch (error) {
            expect(error.response.status).toBe(409);
        }
    });

    it('should signin the user and return a token', async () => {
        try {
            const response = await axios.post(`http://localhost:${port}/auth/signin`, {
                mail: "testing1@gmail.com",
                password: "Arancar584K",
            });
            expect(response.status).toBe(200);
            token = response.data.token;
            expect(token).toBeDefined();
        } catch (error) {
            console.error(error.response.status);
        }
    });

    // Échec de la connexion à cause d'un mauvais mot de passe
    it('should return 401 for wrong password', async () => {
        try {
            await axios.post(`http://localhost:${port}/auth/signin`, {
                mail: "testing1@gmail.com",
                password: "wrongPassword",
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    // Échec de la connexion à cause d'un email non enregistré
    it('should return 401 for unregistered email', async () => {
        try {
            await axios.post(`http://localhost:${port}/auth/signin`, {
                mail: "unregistered@gmail.com",
                password: "Arancar584K",
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });


    it('should return the user information', async () => {
        try {
            if (!token) throw new Error("Token is not defined. Previous test might have failed.");

            const response = await axios.get(`http://localhost:${port}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            expect(response.status).toBe(200);
            console.log(response.data);
            expect(response.data).toBeDefined();
        } catch (error) {
            console.error(error.response.status);
        }
    });

    // Accès refusé si aucun jeton n'est fourni
    it('should return 401 if no token is provided', async () => {
        try {
            await axios.get(`http://localhost:${port}/`);
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    // Accès refusé si un jeton invalide est fourni
    it('should return 401 if invalid token is provided', async () => {
        try {
            await axios.get(`http://localhost:${port}/`, {
                headers: {
                    Authorization: `Bearer invalidTokenHere`
                }
            });
        } catch (error) {
            expect(error.response.status).toBe(401);
        }
    });

    afterAll(async () => {
        try {
            // Supprimez l'utilisateur de test avant de commencer les tests.
            const mail = "testing1@gmail.com"
            const response = await axios.post(`http://localhost:${port}/auth/reset/${mail}`);
            expect(response.status).toBe(200);
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur de test:", error);
        }
    });
});
