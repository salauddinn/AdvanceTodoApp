import { Router, Response, NextFunction } from 'express';
import authMiddleware, { AuthenticatedRequest } from '../../middlewares/auth';
import { body, query, param, validationResult } from 'express-validator';
import { deleteComment, getAllComments, getCommentById, saveComment, updateComment } from './CommentService';
import logger from '../../logger';

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
], async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { email, name, body } = req.body;
    const { postId } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const comment = await saveComment(email, name, body, postId, req.user?.id)

        res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

/**
 * @method - GET
 * @param - /comment?postId={}&pageSize={}&pageNumber={}
 * @description - Get all comments for a post
 */
router.get('/comment', authMiddleware, [
    query('postId').notEmpty().isMongoId()
], async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const postId  = req.query?.postId?.toString();
    const pageSize = Number(req.query.pageSize) || 10;
    const currentPage = Number(req.query.pageNumber) || 1;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const comments = await getAllComments(currentPage, pageSize, postId);

        res.status(200).json(comments);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});
/**
 * @method - GET
 * @param - /comment/:commentId
 * @description - Get a comment by ID
 */
router.get('/comment/:commentId', authMiddleware, [
    param('commentId').notEmpty().isMongoId()
], async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const comment = await getCommentById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(comment);
    } catch (error) {
        logger.error(error);
        next(error);
    }
});


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
], async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, name, body } = req.body;
        const comment = await updateComment(id, req.user?.id, email, name, body);

        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        logger.error(error);
        next(error);
    }
});
/**
 * @method - DELETE
 * @param - /comment/:id
 * @description - Delete a comment
 */
router.delete('/comment/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const message = await deleteComment(id, req.user?.id)
        res.status(200).json({ message: message });
    } catch (error) {
        logger.error(error);
        next(error);
    }
});

export { router as CommentRouter };