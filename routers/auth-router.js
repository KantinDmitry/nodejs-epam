import { Router } from 'express';
import find from 'lodash.find';
import pick from 'lodash.pick';
import jwt from 'jsonwebtoken';
import { generateAuthResponse } from 'helpers/auth-helpers';

const authRouter = Router();
const fakeData = {
    users: [
        { id: 1, name: 'user1', password: 'password1' },
        { id: 2, name: 'user2', password: 'password2' },
        { id: 3, name: 'user3', password: 'password3' },
    ],
};
const TOKEN_EXPIRATION_TIME = 120;

authRouter.post('/', (req, res) => {
    const { name, password } = req.body;
    const user = find(fakeData.users, { name });

    if (!user || user.password !== password) {
        res.status(400).json({
            code: 400,
            message: 'wrong combination of name and password',
            data: '',
        });

        return;
    }

    const payload = pick(user, ['name', 'id']);
    const token = jwt.sign(payload, 'secret', { expiresIn: TOKEN_EXPIRATION_TIME });

    res.status(200).json(generateAuthResponse(user, token));
});

export default authRouter;
