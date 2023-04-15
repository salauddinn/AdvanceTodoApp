import { Router, Request, Response } from "express";
import { check, validationResult } from "express-validator";
import { Post, PostDocument } from "../../models/PostModal";
import authMiddleware, { AuthenticatedRequest } from "../../middlewares/auth";
import { PaginateOptions } from "mongoose";

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
    async (req: AuthenticatedRequest, res: Response) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
            });
        }

        const { title, body } = req.body;
        const userId = req.user?._id;

        try {
            const post = new Post({
                title,
                body,
                user: userId
            });

            await post.save();

            res.status(201).json(post);
        } catch (err) {
            console.log(err.message);
            res.status(500).send("Error in Saving");
        }
    }
);
/**
 * @method - GET
 * @param - /post
 * @description - Get all posts with pagination
 */
router.get("/post", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const pageSize = req.query.pageSize || 10;
    const currentPage = Number(req.query.pageNumber) || 1; 

    try {
        const options = {
            page: currentPage,
            limit: pageSize,
            sort: { createdAt: -1 },
        };
        const { docs, totalDocs, totalPages } = await Post.paginate({ user: req.user.id }, options as PaginateOptions);

        res.status(200).json({ posts: docs, page: currentPage, pages: totalPages, totalPosts: totalDocs });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

/**
 * @method - GET
 * @param - /post/:id
 * @description - Get a specific post
 */
router.get("/post/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, user: req.user.id });
        if (!post) {
            return res.status(404).json({
                message: "Not able to find post"
            });
        }
        res.status(200).json(post);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server Error"
        });
    }
});

/**
 * @method - PUT
 * @param - /post/:id
 * @description - Update a post
 */
router.put("/post/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const { title, body } = req.body;

    try {
        let post = await Post.findOne({ _id: req.params.id, user: req.user.id });
        if (!post) {
            return res.status(404).json({
                message: "Not able to find post"
            });
        }

        if (title) {
            post.title = title;
        }
        if (body) {
            post.body = body;
        }

        await post.save();

        res.status(200).json(post);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

/**
 * @method - DELETE
 * @param - /post/:id
 * @description - Delete a post
 */
router.delete("/post/:id", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const post = await Post.findOne({ _id: req.params.id, user: req.user.id });
        if (!post) {
            return res.status(404).json({
                message: "Not able to find post"
            });
        }

        await post.remove();

        res.status(200).json({
            message: "Post deleted successfully"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});

export { router as PostRouter };