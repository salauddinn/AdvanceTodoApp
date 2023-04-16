import { Router } from 'express';
import { body, param, query } from 'express-validator';
import authMiddleware from '../../middlewares/auth';
import { cacheMiddleware } from '../../middlewares/cache';
import { deleteCommentHandler, getAllCommentsHandler, getCommentHandler, saveCommentHandler, updateCommentHandler } from './CommentHandler';

const router = Router();
/**
 * @openapi
 * /comment/{postId}:
 *   post:
 *     summary: Create new comment on a post
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *               body:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid request body or parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
/**
 * @method - POST
 * @param - /comment/:postId
 * @description - Create new comment on a post
 */
router.post('/comment/:postId', authMiddleware, [
    body('email').notEmpty().isEmail(),
    body('name').notEmpty().isString(),
    body('body').notEmpty().isString(),
    param('postId').notEmpty().isMongoId()
], saveCommentHandler);
/**
 * @openapi
 * /comment:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the post
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: The number of comments to return per page
 *       - in: query
 *         name: pageNumber
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: The page number to return
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get('/comment', authMiddleware, cacheMiddleware, [
    query('postId').notEmpty().isMongoId()
], getAllCommentsHandler);

/**
 * @openapi
 * /comment/{commentId}:
 *   get:
 *     summary: Get a comment by ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the comment to retrieve
 *     responses:
 *       200:
 *         description: Comment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


router.get('/comment/:commentId', authMiddleware, cacheMiddleware, [
    param('commentId').notEmpty().isMongoId()
], getCommentHandler);


/**
 * @openapi
 * /comment/{id}:
 *   put:
 *     summary: Update a comment by ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the comment to update
 *     requestBody:
 *       description: Comment fields to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */


router.put('/comment/:id', authMiddleware, [
    param('id').notEmpty().isMongoId(),
    body('email').optional().isEmail(),
    body('name').optional().isString(),
    body('body').optional().isString()
], updateCommentHandler);

/**
 * @openapi
 * /comment/{id}:
 *   delete:
 *     summary: Delete a comment by ID
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: ID of the comment to delete
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid request parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.delete('/comment/:id', authMiddleware, deleteCommentHandler);

export { router as CommentRouter };
