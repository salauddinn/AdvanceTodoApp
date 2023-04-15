import { Router, Response } from 'express';
import authMiddleware, { AuthenticatedRequest } from '../../middlewares/auth';
import { Comment, CommentDocument } from '../../models/CommentModal';
import { body, param, validationResult } from 'express-validator';
import { PaginateOptions } from 'mongoose';

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
        const comment: CommentDocument = new Comment({
            email,
            name,
            body,
            post: postId,
            user: req.user.id,
        });

        await comment.save();

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
    const pageSize = req.query.pageSize || 10;
    const currentPage = Number(req.query.pageNumber) || 1;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const options = {
            page: currentPage,
            limit: pageSize,
            sort: { createdAt: -1 },
        }
        const comments = await Comment.paginate(
            { post: postId }, options as PaginateOptions);

        res.status(200).json(comments);
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
        const comment = await Comment.findOneAndUpdate({ _id: id, user: req.user.id }, req.body, { new: true });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or you are not authorized' });
        }

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
        const comment = await Comment.findOneAndDelete({ _id: id, user: req.user.id });

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found or you are not authorized' });
        }

        res.status(200).json({ message: 'Comment deleted successfully', comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export { router as CommentRouter };