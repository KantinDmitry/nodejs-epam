import { Router } from 'express';

const authRouter = Router();
const fakeData = {
    users: [
        { id: 1, name: 'user1', password: 'password1' },
        { id: 2, name: 'user2', password: 'password2' },
        { id: 3, name: 'user3', password: 'password3' },
    ],
};

authRouter.get('/', (req, res) => {
    res.status(200).json({ message: 'hi' });
});


export default authRouter;
