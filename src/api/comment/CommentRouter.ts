import { Router } from 'express';
import authMiddleware from '../../middlewares/auth';
import { body, query, param } from 'express-validator';
import { cacheMiddleware } from '../../middlewares/cache';
import { deleteCommentHandler, getAllCommentsHandler, getCommentHandler, saveCommentHandler, updateCommentHandler } from './CommentHandler';

const router = Router();

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
 * @method - GET
 * @param - /comment?postId={}&pageSize={}&pageNumber={}
 * @description - Get all comments for a post
 */
router.get('/comment', authMiddleware, cacheMiddleware, [
    query('postId').notEmpty().isMongoId()
], getAllCommentsHandler);
/**
 * @method - GET
 * @param - /comment/:commentId
 * @description - Get a comment by ID
 */
router.get('/comment/:commentId', authMiddleware, cacheMiddleware, [
    param('commentId').notEmpty().isMongoId()
], getCommentHandler);


/**
 * @method - PUT
 * @param - /comment/:id
 * @description - Update a comment
 */
router.put('/comment/:id', authMiddleware, [
    param('id').notEmpty().isMongoId(),
    body('email').optional().isEmail(),
    body('name').optional().isString(),
    body('body').optional().isString()
], updateCommentHandler);
/**
 * @method - DELETE
 * @param - /comment/:id
 * @description - Delete a comment
 */
router.delete('/comment/:id', authMiddleware, deleteCommentHandler);

export { router as CommentRouter };