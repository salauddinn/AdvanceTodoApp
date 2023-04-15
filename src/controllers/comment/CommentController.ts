import { Router, Response } from 'express';
import authMiddleware, { AuthenticatedRequest } from '../../middlewares/auth';
import { body, param, validationResult } from 'express-validator';
import { deleteComment, getAllComments, getCommentById, saveComment, updateComment } from './CommentService';

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
], async (req: AuthenticatedRequest, res: Response) => {
    const { email, name, body } = req.body;
    const { postId } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const comment = saveComment(email, name, body, postId, req.user._id)

        res.status(201).json({ message: 'Comment created successfully', comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

/**
 * @method - GET
 * @param - /comment/:postId
 * @description - Get all comments for a post
 */
router.get('/comment/:postId', authMiddleware, [
    param('postId').notEmpty().isMongoId()
], async (req: AuthenticatedRequest, res: Response) => {
    const { postId } = req.params;
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
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
/**
 * @method - GET
 * @param - /comment/:commentId
 * @description - Get a comment by ID
 */
router.get('/comment/:commentId', authMiddleware, [
    param('commentId').notEmpty().isMongoId()
], async (req: AuthenticatedRequest, res: Response) => {
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
        console.error(error);
        res.status(500).json({ message: 'Server error' });
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
], async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, name, body } = req.body;
        const comment = await updateComment(id, req.user._id, email, name, body);

        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
/**
 * @method - DELETE
 * @param - /comment/:id
 * @description - Delete a comment
 */
router.delete('/comment/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    try {
        const message = await deleteComment(req.params.id, req.user._id)
        res.status(200).json({ message: message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export { router as CommentRouter };