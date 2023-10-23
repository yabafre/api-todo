// __test__/userSignin.test.js

require('dotenv').config();
const port = process.env.PORT || 3000;
const axios = require('axios');

describe('Auth Routes Signin', () => {

    let token;

    describe('POST /auth/signin', () => {
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
                console.error(error);
            }
        });
    });

    describe('GET /user', () => {
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
                console.error(error);
            }
        });
    });
});
