import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { Todo, TodoDocument } from "../../models/TodoModal";
import authMiddleware, { AuthenticatedRequest } from "../../middlewares/auth";
import { PaginateOptions } from "mongoose";

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
    async (req: AuthenticatedRequest, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { content, completed = false } = req.body;
        const userId = req.user?._id;

        try {
            const todo = new Todo({
                content,
                user: userId,
                completed,
            });

            await todo.save();

            res.status(201).json(todo);
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);
/**
 * @method - GET
 * @param - /todo
 * @description - Get all todos with pagination
 */
router.get("/todo", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const pageSize = req.query.pageSize || 10;
    const currentPage = Number(req.query.pageNumber) || 1;

    try {
        const options = {
            page: currentPage,
            limit: pageSize,
            sort: { createdAt: -1 },
        };
        const { docs, totalDocs, totalPages } = await Todo.paginate({ user: { $ne: req.user.id } }, options as PaginateOptions);

        res.status(200).json({ todos: docs, page: currentPage, pages: totalPages, totalTodos: totalDocs });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

/**
 * @method - GET
 * @param - /todo/:id
 * @description - Get a specific todo
 */
router.get("/todo/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: { $ne: req.user.id } });
        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }
        res.status(200).json(todo);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

/**
* @method - PUT
* @param - /todo/:id
* @description - Update a todo
*/
router.put("/todo/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { content, completed } = req.body;

    try {
        let todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
        if (!todo) {
            return res.status(404).json({
                message: "Not able to find todo"
            });
        }

        if (content) {
            todo.content = content;
        }
        if (completed !== undefined) {
            todo.completed = completed;
        }

        await todo.save();

        res.status(200).json(todo);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

/**
 * @method - DELETE
 * @param - /todo/:id
 * @description - Delete a todo
 */
router.delete("/todo/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
        if (!todo) {
            return res.status(404).json({
                message: "Not able to find todo"
            });
        }

        await todo.remove();

        res.status(200).json({
            message: "Todo deleted successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

export { router as TodoRouter }