import { Router } from 'express';
import { users } from 'data';

const usersRouter = Router();

usersRouter.get('/', (req, res) => {
    res.status(200).json(users);
});


export default usersRouter;
