import { NextFunction, Response, Router } from "express";
import { check, validationResult } from "express-validator";
import authMiddleware, { AuthenticatedRequest } from "../../middlewares/auth";
import { deleteTodo, getAlltodos, getTodo, saveTodo, updateTodo } from "./TodoService";
import logger from "../../logger";

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
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
);
/**
 * @method - GET
 * @param - /todo?pageSize={}&pageNumber={}
 * @description - Get all todos with pagination
 */
router.get("/todo", authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const currentPage = Number(req.query.pageNumber) || 1;

    try {
        const userId = req.user?.id;
        const todos = await getAlltodos(currentPage, pageSize, userId)
        res.status(200).json(todos);
    } catch (e) {
        logger.error(e.message);
        next(e);
    }
});

/**
 * @method - GET
 * @param - /todo/:id
 * @description - Get a specific todo
 */
router.get("/todo/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const todo = await getTodo(req.params.id, req.user._id)
        res.status(200).json(todo);
    } catch (e) {
        logger.error(e.message);
        next(e);
    }
});

/**
* @method - PUT
* @param - /todo/:id
* @description - Update a todo
*/
router.put("/todo/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { content, completed } = req.body;

    try {
        const todo = updateTodo(req.params.id, req.user._id, content, completed)
        res.status(200).json(todo);
    } catch (e) {
        logger.error(e.message);
        next(e);
    }
});

/**
 * @method - DELETE
 * @param - /todo/:id
 * @description - Delete a todo
 */
router.delete("/todo/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const meesage = await deleteTodo(req.params.id, req.user._id)
        res.status(200).json({
            message: meesage
        });
    } catch (e) {
        logger.error(e.message);
        next(e);
    }
});

export { router as TodoRouter };



