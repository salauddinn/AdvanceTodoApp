import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { json } from 'express';
import { CommentRouter } from './api/comment/CommentRouter';
import { PostRouter } from './api/post/PostRouter';
import { TodoRouter } from './api/todo/TodoRouter';
import { UserRouter } from './api/user/UserRouter';
import { limiter } from './config/rateLimitConfig';
import { RouteNotFoundError } from './errors';
import { errorHandler } from './middlewares';

const app = express();
app.use(cookieParser());
app.use(limiter)
app.set('trust proxy', true);
app.use(json());
app.use(cors());
app.use(UserRouter)
app.use(TodoRouter)
app.use(PostRouter)
app.use(CommentRouter)
app.all('*', () => {
    throw new RouteNotFoundError();
});

app.use(errorHandler);

export { app };
