import { Router } from 'express';
import usersRouter from 'routers/users-router';
import productsRouter from 'routers/products-router';

const apiRouter = Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productsRouter);

export default apiRouter;
