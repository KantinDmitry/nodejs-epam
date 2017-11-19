import express from 'express';
import cookieParser from 'middlewares/cookie-parser';
import queryParser from 'middlewares/query-parser';
import bodyParser from 'body-parser';
import apiRouter from 'routers/api-router';
import passport from 'passport-setup';
import session from 'express-session';
import { SECRET } from 'config/configuration';

const app = express();

app.use(cookieParser);
app.use(queryParser);
app.use(session({ secret: SECRET }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/api', apiRouter);

export default app;
