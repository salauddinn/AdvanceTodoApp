import { Router } from "express";
import { check } from "express-validator";
import authMiddleware from "../../middlewares/auth";
import { cacheMiddleware } from "../../middlewares/cache";
import { deleteTodoHandler, getAllTodoHandler, getTodoHandler, saveTodoHandler, updateTodoHandler } from "./TodoHandler";

const router = Router();

/**
 * @openapi
 * /todo:
 *   post:
 *     summary: Create new todo
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully created a new todo
 *       400:
 *         description: Invalid request body
 *       401:
 *         description: Unauthorized request
 */
router.post(
    "/todo",
    [check("content", "Please enter todo content").notEmpty()],
    authMiddleware,
    saveTodoHandler
);


/**
 * @openapi
 * /todo:
 *   get:
 *     summary: Get all todos with pagination
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: pageSize
 *         in: query
 *         description: Number of todos per page
 *         required: false
 *         schema:
 *           type: integer
 *       - name: pageNumber
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved todos
 *       401:
 *         description: Unauthorized request
 */
router.get("/todo", authMiddleware, cacheMiddleware, getAllTodoHandler);

/**
 * @openapi
 * /todo/{id}:
 *   get:
 *     summary: Get a specific todo
 *     tags: [Todo]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the todo to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the todo
 *       401:
 *         description: Unauthorized request
 *       404:
 *         description: Todo not found
 */

router.get("/todo/:id", authMiddleware, cacheMiddleware, getTodoHandler);

/**
 * @openapi
 * /todo/{id}:
 *   put:
 *     summary: Update a todo
 *     tags: [Todo]
 *     description: Update a specific todo by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New todo content to replace the existing one
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Todo'
  *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Todo updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       '400':
 *         description: Invalid request body or parameters
 *       '401':
 *         description: Unauthorized, authentication required
 *       '404':
 *         description: Todo not found
 *       '500':
 *         description: Internal server error
 */

router.put("/todo/:id", authMiddleware, updateTodoHandler);

/**
 * @openapi
 * /todo/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todo]
 *     description: Delete a specific todo by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the todo to delete
 *         schema:
 *           type: string
  *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: Todo deleted successfully
 *       '401':
 *         description: Unauthorized, authentication required
 *       '404':
 *         description: Todo not found
 *       '500':
 *         description: Internal server error
 */

router.delete("/todo/:id", authMiddleware, deleteTodoHandler);

export { router as TodoRouter };



