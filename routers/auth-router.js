import { Router } from 'express';
import find from 'lodash.find';
import pick from 'lodash.pick';
import jwt from 'jsonwebtoken';
import { generateAuthResponse } from 'helpers/auth-helpers';
import { SECRET } from 'config/configuration';
import { users } from 'data';
import passwordHash from 'password-hash';

const authRouter = Router();
const TOKEN_EXPIRATION_TIME = 120;

authRouter.post('/', (req, res) => {
    const { name, password } = req.body;
    const user = find(users, { name });

    if (!user || !passwordHash.verify(password, user.passwordHash)) {
        res.status(400).json({
            code: 400,
            message: 'wrong combination of name and password',
            data: '',
        });

        return;
    }

    const payload = pick(user, ['name', 'id']);
    const token = jwt.sign(payload, SECRET, { expiresIn: TOKEN_EXPIRATION_TIME });

    res.status(200).json(generateAuthResponse(user, token));
});

export default authRouter;
