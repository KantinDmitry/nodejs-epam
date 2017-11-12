import { Router } from 'express';
import usersRouter from 'routers/users-router';
import productsRouter from 'routers/products-router';
import authRouter from 'routers/auth-router';

const apiRouter = Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
