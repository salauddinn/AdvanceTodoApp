import { Router, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
import authMiddleware, { AuthenticatedRequest } from "../../middlewares/auth";
import { deletePost, getAllPosts, getPost, savePost, updatePost } from "./PostService";
import logger from "../../logger";

const router = Router();

/**
 * @method - POST
 * @param - /post
 * @description - Create new post
 */
router.post(
    "/post",
    [
        check("title", "Please enter post title").notEmpty(),
        check("body", "Please enter post body").notEmpty()
    ],
    authMiddleware,
    async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
);
/**
 * @method - GET
 * @param - /post
 * @description - Get all posts with pagination
 */
router.get("/post", authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const pageSize = Number(req.query.pageSize) || 10;
    const currentPage = Number(req.query.pageNumber) || 1;

    try {
        const posts = await getAllPosts(currentPage, pageSize, req.user?.id);
        res.status(200).json(posts);
    } catch (e) {
        logger.error(e);
        next(e);
    }
});

/**
 * @method - GET
 * @param - /post/:id
 * @description - Get a specific post
 */
router.get("/post/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const post = await getPost(req.params.id, req.user.id)
        res.status(200).json(post);
    } catch (e) {
        logger.error(e);
        next(e);
    }
});

/**
 * @method - PUT
 * @param - /post/:id
 * @description - Update a post
 */
router.put("/post/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { title, body } = req.body;

    try {
        const post = await updatePost(req.params.id, req.user.id, title, body);

        res.status(200).json(post);
    } catch (e) {
        logger.error(e);
        next(e);
    }
});

/**
 * @method - DELETE
 * @param - /post/:id
 * @description - Delete a post
 */
router.delete("/post/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const message = await deletePost(req.params.id, req.user.id)

        res.status(200).json({
            message: message
        });
    } catch (e) {
        logger.error(e);
        next(e);
    }
});

export { router as PostRouter };

