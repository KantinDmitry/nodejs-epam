import express from 'express';

const usersRouter = express.Router();
const fakeData = {
    users: [
        { id: 1, name: 'user1' },
        { id: 2, name: 'user2' },
        { id: 3, name: 'user3' },
    ],
};

usersRouter.get('/', (req, res) => {
    res.status(200).json(fakeData.users);
});


export default usersRouter;
