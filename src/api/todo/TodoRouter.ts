import { NextFunction, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import authMiddleware, { AuthenticatedRequest } from "../../middlewares/auth";
import { deleteTodo, getAlltodos, getTodo, saveTodo, updateTodo } from "./TodoService";
import logger from "../../logger";
import { cacheMiddleware } from "../../middlewares/cache";
import { redisClient } from "../../config/redisConfig";
import { deleteTodoHandler, getAllTodoHandler, getTodoHandler, saveTodoHandler, updateTodoHandler } from "./TodoHandler";

const router = Router();

/**
 * @method - POST
 * @param - /todo
 * @description - Create new todo
 */
router.post(
    "/todo",
    [check("content", "Please enter todo content").notEmpty()],
    authMiddleware,
    saveTodoHandler
);
/**
 * @method - GET
 * @param - /todo?pageSize={}&pageNumber={}
 * @description - Get all todos with pagination
 */
router.get("/todo", authMiddleware, cacheMiddleware, getAllTodoHandler);

/**
 * @method - GET
 * @param - /todo/:id
 * @description - Get a specific todo
 */
router.get("/todo/:id", authMiddleware, cacheMiddleware, getTodoHandler);

/**
* @method - PUT
* @param - /todo/:id
* @description - Update a todo
*/
router.put("/todo/:id", authMiddleware, updateTodoHandler);

/**
 * @method - DELETE
 * @param - /todo/:id
 * @description - Delete a todo
 */
router.delete("/todo/:id", authMiddleware, deleteTodoHandler);

export { router as TodoRouter };



