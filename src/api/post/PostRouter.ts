/**
 * @openapi
 * tags:
 *   name: Posts
 *   description: Endpoints for managing posts
 */
import { Router } from "express";
import { check } from "express-validator";
import authMiddleware from "../../middlewares/auth";
import { cacheMiddleware } from "../../middlewares/cache";
import { deletePostHandler, getAllPostHandler, getPostHandler, savePostHandler, updatePostHandler } from "./PostHandler";

const router = Router();


/**
 * @openapi
 * /post:
 *   post:
 *     tags:
 *       - Posts
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the post
 *               body:
 *                 type: string
 *                 description: The body of the post
 *             required:
 *               - title
 *               - body
  *     security:
 *       - bearerAuth: []
 *     responses:
 *       '201':
 *         description: Created
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */

router.post(
    "/post",
    [
        check("title", "Please enter post title").notEmpty(),
        check("body", "Please enter post body").notEmpty()
    ],
    authMiddleware,
    savePostHandler
);
/**
 * @openapi
 * /post:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get all posts with pagination
 *     parameters:
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: true
 *         description: Number of posts to return
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *         required: true
 *         description: Page number of the posts to return
  *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.get("/post", authMiddleware, cacheMiddleware, getAllPostHandler);

/**
 * @openapi
 * /post/{id}:
 *   get:
 *     tags:
 *       - Posts
 *     summary: Get a specific post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to retrieve
  *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */

router.get("/post/:id", authMiddleware, cacheMiddleware, getPostHandler);

/**
 * @openapi
 * /post/{id}:
 *   put:
 *     tags:
 *       - Posts
 *     summary: Update a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: The new title of the post
 *               body:
 *                 type: string
 *                 description: The new body of the post
 *             required:
 *               - title
 *               - body
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '404':
 *         description: Post not found
 *       '500':
 *         description: Internal server error
 */
router.put("/post/:id", authMiddleware, updatePostHandler);

/**
 * @openapi
 * /post/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post with the given ID
 *     tags:
 *       - Posts
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the post to delete
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: Successfully deleted the post
 *       '404':
 *         description: Post with the given ID not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/post/:id", authMiddleware, deletePostHandler)

export { router as PostRouter };

