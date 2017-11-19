import { Router } from 'express';
import find from 'lodash.find';
import pick from 'lodash.pick';
import jwt from 'jsonwebtoken';
import { generateAuthResponse } from 'helpers/auth-helpers';
import { SECRET } from 'config/configuration';
import { users } from 'data';
import passwordHash from 'password-hash';
import passport from 'passport';

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

authRouter.post('/local', passport.authenticate('local', { session: false }), (req, res) => {
    if (req.isAuthenticated()) {
        const { user } = req;
        const payload = pick(user, ['name', 'id']);
        const token = jwt.sign(payload, SECRET, { expiresIn: TOKEN_EXPIRATION_TIME });

        res.status(200).json(generateAuthResponse(user, token));
    }
});

authRouter.get('/facebook', passport.authenticate('facebook'));

const facebookAuthCheck = passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false,
});

authRouter.get('/facebook/callback', facebookAuthCheck, (req, res) => {
    res.status(200).json(req.user);
});

authRouter.get('/twitter', passport.authenticate('twitter'));

const twitterAuthCheck = passport.authenticate('twitter', {
    failureRedirect: '/login',
    session: false,
});

authRouter.get('/twitter/callback', twitterAuthCheck, (req, res) => {
    res.status(200).json(req.user);
});

authRouter.get('/google', passport.authenticate('google', { scope: ['profile'] }));

const googoleAuthCheck = passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
});

authRouter.get('/google/callback', googoleAuthCheck, (req, res) => {
    res.status(200).json(req.user);
});

export default authRouter;
