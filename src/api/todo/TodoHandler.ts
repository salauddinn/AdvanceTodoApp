import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../../middlewares/auth";
import { deleteTodo, getAlltodos, getTodo, saveTodo, updateTodo } from "./TodoService";
import logger from "../../logger";
import { redisClient } from "../../config/redisConfig";


export const saveTodoHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { content, completed = false } = req.body;
    const userId = req.user?.id;

    try {
        const todo = await saveTodo(userId, content, completed)
        res.status(201).json(todo);
    } catch (err) {
        logger.error(err.message);
        next(err);
    }
}
export const getAllTodoHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const currentPage = Number(req.query.pageNumber) || 1;

    try {
        const userId = req.user?.id;
        const todos = await getAlltodos(currentPage, pageSize, userId)
        redisClient.setEx(req.originalUrl, 300, JSON.stringify(todos));

        res.status(200).json(todos);
    } catch (e) {
        logger.error(e.message);
        next(e);
    }
}
export const getTodoHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const todo = await getTodo(req.params.id, req.user.id)
        redisClient.setEx(req.originalUrl, 300, JSON.stringify(todo));
        res.status(200).json(todo);
    } catch (e) {
        logger.error(e.message);
        next(e);
    }
}
export const updateTodoHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { content, completed } = req.body;

    try {
        const todo = updateTodo(req.params.id, req.user.id, content, completed)
        logger.info(`Updat todo`,todo);
        res.status(200).json(todo);
    } catch (e) {
        logger.error(e.message);
        next(e);
    }
}
export const deleteTodoHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const meesage = await deleteTodo(req.params.id, req.user.id)
        res.status(200).json({
            message: meesage
        });
    } catch (e) {
        logger.error(e.message);
        next(e);
    }
}




