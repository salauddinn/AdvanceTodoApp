import { Router } from "express";
import { check } from "express-validator";
import authMiddleware from "../../middlewares/auth";
import { cacheMiddleware } from "../../middlewares/cache";
import { deletePostHandler, getAllPostHandler, getPostHandler, savePostHandler, updatePostHandler } from "./PostHandler";

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
    savePostHandler
);
/**
 * @method - GET
 * @param - /post?pageSize={}&pageNumber={}
 * @description - Get all posts with pagination
 */
router.get("/post", authMiddleware, cacheMiddleware, getAllPostHandler);

/**
 * @method - GET
 * @param - /post/:id
 * @description - Get a specific post
 */
router.get("/post/:id", authMiddleware, cacheMiddleware, getPostHandler);

/**
 * @method - PUT
 * @param - /post/:id
 * @description - Update a post
 */
router.put("/post/:id", authMiddleware, updatePostHandler);

/**
 * @method - DELETE
 * @param - /post/:id
 * @description - Delete a post
 */
router.delete("/post/:id", authMiddleware, deletePostHandler)

export { router as PostRouter };

