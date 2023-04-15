import express, { json } from 'express';
import { RouteNotFoundError } from './errors';
import { errorHandler } from './middlewares';
import cors from 'cors';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cors());

app.all('*', () => {
    throw new RouteNotFoundError();
});

app.use(errorHandler);

export { app };
