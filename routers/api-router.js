import { Router } from 'express';
import usersRouter from 'routers/users-router';
import productsRouter from 'routers/products-router';
import authRouter from 'routers/auth-router';
import tokenVerificationFactory from 'middlewares/token-verificator';
import { SECRET } from 'config/configuration';

console.log('SECRET', SECRET);
const apiRouter = Router();
const tokenVerificationMiddleware = tokenVerificationFactory(SECRET);

apiRouter.use('/users', tokenVerificationMiddleware, usersRouter);
apiRouter.use('/products', tokenVerificationMiddleware, productsRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
