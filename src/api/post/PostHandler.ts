import { Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../../middlewares/auth";
import { deletePost, getAllPosts, getPost, savePost, updatePost } from "./PostService";
import logger from "../../logger";
import { redisClient } from "../../config/redisConfig";

export const savePostHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    const { title, body } = req.body;
    const userId = req.user.id;

    try {
        const post = await savePost(title, body, userId)
        res.status(201).json(post);
    } catch (err) {
        logger.error(err);
        next(err);
    }
}
export const getAllPostHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const currentPage = Number(req.query.pageNumber) || 1;

    try {
        const posts = await getAllPosts(currentPage, pageSize);
        redisClient.setEx(req.originalUrl, 300, JSON.stringify(posts));
        res.status(200).json(posts);
    } catch (e) {
        logger.error(e);
        next(e);
    }
}


export const getPostHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const post = await getPost(req.params.id)
        redisClient.setEx(req.originalUrl, 300, JSON.stringify(post));
        res.status(200).json(post);
    } catch (e) {
        logger.error(e);
        next(e);
    }
}

export const updatePostHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { title, body } = req.body;

    try {
        const post = await updatePost(req.params.id, req.user.id, title, body);

        res.status(200).json(post);
    } catch (e) {
        logger.error(e);
        next(e);
    }
}

export const deletePostHandler = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const message = await deletePost(req.params.id, req.user.id)

        res.status(200).json({
            message: message
        });
    } catch (e) {
        logger.error(e);
        next(e);
    }
}



