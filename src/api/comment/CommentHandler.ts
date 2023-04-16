import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../../middlewares/auth';
import { validationResult } from 'express-validator';
import { deleteComment, getAllComments, getCommentById, saveComment, updateComment } from './CommentService';
import logger from '../../logger';
import { redisClient } from '../../config/redisConfig';


export const saveCommentHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
}

export const getAllCommentsHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const postId = req.query?.postId?.toString();
    const pageSize = Number(req.query.pageSize) || 10;
    const currentPage = Number(req.query.pageNumber) || 1;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const comments = await getAllComments(currentPage, pageSize, postId);
        redisClient.setEx(req.originalUrl, 300, JSON.stringify(comments));
        res.status(200).json(comments);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}
export const getCommentHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { commentId } = req.params;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const comment = await getCommentById(commentId);
        redisClient.setEx(req.originalUrl, 300, JSON.stringify(comment));

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json(comment);
    } catch (error) {
        logger.error(error);
        next(error);
    }
}


export const updateCommentHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
}
export const deleteCommentHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
        const message = await deleteComment(id, req.user?.id)
        res.status(200).json({ message: message });
    } catch (error) {
        logger.error(error);
        next(error);
    }
}
