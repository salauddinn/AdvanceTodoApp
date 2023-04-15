import cors from 'cors';
import express, { json } from 'express';
import { CommentRouter } from './controllers/comment/CommentController';
import { PostRouter } from './controllers/post/PostController';
import { TodoRouter } from './controllers/todo/TodoController';
import { UserRouter } from './controllers/user/UserController';
import { RouteNotFoundError } from './errors';
import { errorHandler } from './middlewares';
const app = express();
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
