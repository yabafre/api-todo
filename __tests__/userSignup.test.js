// __test__/userSignup.test.js

require('dotenv').config();
const port = process.env.PORT || 3000;
const axios = require('axios');

describe('Auth Routes Signup', () => {

    let token;

    describe('POST /auth/signup', () => {
        it('should create a new user and return a token', async () => {
            try {
                const response = await axios.post(`http://localhost:${port}/auth/signup`, {
                    user: "Testing1",
                    mail: "testing1@gmail.com",
                    password: "Arancar584K",
                });
                expect(response.status).toBe(201);
                token = response.data.token;
                expect(token).toBeDefined();
            } catch (error) {
                console.error(error);
            }
        });
    });

    describe('GET /auth/signup/confirm', () => {
        it('should confirm the user signup using the token', async () => {
            try {
                if (!token) throw new Error("Token is not defined. Previous test might have failed.");

                const response = await axios.get(`http://localhost:${port}/auth/signup/confirm?token=${token}`);
                expect(response.status).toBe(201);
            } catch (error) {
                console.error(error);
            }
        });
    });

});
