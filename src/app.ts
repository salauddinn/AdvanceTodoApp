import cors from 'cors';
import express, { json } from 'express';
import { SignupRouter } from './controllers/user/user.singup';
import { RouteNotFoundError } from './errors';
import { errorHandler } from './middlewares';
import { LoginRouter } from './controllers/user/user.login';
import { TodoRouter } from './controllers/todo/todo';
import { PostRouter } from './controllers/post/post';
import { CommentRouter } from './controllers/comment/comment';
const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(cors());
app.use(SignupRouter)
app.use(LoginRouter)
app.use(TodoRouter)
app.use(PostRouter)
app.use(CommentRouter)

app.all('*', () => {
    throw new RouteNotFoundError();
});

app.use(errorHandler);

export { app };
