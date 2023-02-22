import express from 'express';

import mongoose from 'mongoose';

import { loginValidator, registerValidator } from './validations/auth';
import CheckAuth from './utils/checkAuth';
import * as UserController from './controllers/UserController';

mongoose
    .connect('mongodb+srv://kirill:werty123@firstcluster.rglwqto.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => {
        console.log('mongo ok');
    })
    .catch((err) => console.log('DB ERROR', err));

const app = express();

app.use(express.json());

app.get('/huy', (request, response) => {
    response.send('Huy');
});

app.get('/auth/me', CheckAuth, UserController.userMe);

app.post('/auth/register', registerValidator, UserController.register);

app.post('/auth/login', loginValidator, UserController.login);

app.listen(3001, () => {
    console.log('server ok');
});
