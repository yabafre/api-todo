// __test__/userTask.test.js

require('dotenv').config();
const port = process.env.PORT || 3000;
const axios = require('axios');

describe('Task Routes', () => {

    let token;
    let tokenSing;
    let taskId;

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
            tokenSing = response.data.token;
            expect(tokenSing).toBeDefined();
        } catch (error) {
            console.error(error.response.status);
        }
    });

    it('should confirm the user signup using the token', async () => {
        try {
            if (!tokenSing) throw new Error("Token is not defined. Previous test might have failed.");

            const response = await axios.get(`http://localhost:${port}/auth/signup/confirm?token=${tokenSing}`);
            expect(response.status).toBe(201);
        } catch (error) {
            console.error(error.response.status);
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

    it('should create a new task', async () => {
        try {
            const response = await axios.post(`http://localhost:${port}/task/create`, {
                body: "Testing1",},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            expect(response.status).toBe(201);
            taskId = response.data.task._id;
        } catch (error) {
            console.error(error.response.status);
        }
    });

    it('should create a new task', async () => {
        try {
            const response = await axios.post(`http://localhost:${port}/task/create`, {
                body: "Testing2",},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            expect(response.status).toBe(201);
            taskId = response.data.task._id;
        } catch (error) {
            console.error(error.response.status);
        }
    });

    it('should update a task', async () => {
        try {
            const response = await axios.put(`http://localhost:${port}/task/update/${taskId}`, {
                body: "Upadate testing 1",},{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            expect(response.status).toBe(200);
        } catch (error) {
            console.error(error.response.status);
        }
    });

    it('should delete a task', async () => {
        try {
            const response = await axios.delete(`http://localhost:${port}/task/delete/${taskId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            expect(response.status).toBe(200);
        } catch (error) {
            console.error(error.response.status);
        }
    });

})