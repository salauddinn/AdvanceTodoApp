import mongoose, { PaginateOptions } from "mongoose";
import { NotFoundError } from "../../errors/NotFoundError";
import { Post } from "./PostModal";

export const    savePost = async (title: string, body: string, userId: string) => {
    console.log(title,body,userId);
    const post = new Post({
        title,
        body,
        user: new mongoose.Types.ObjectId(userId)
    });

    await post.save();



    return post
}
export const getAllPosts = async (currentPage: number, pageSize: number, userid: string) => {
    const options = {
        page: currentPage,
        limit: pageSize,
        sort: { createdAt: -1 },
    };
    const { docs, totalDocs, totalPages } = await Post.paginate({ user: userid }, options as PaginateOptions);

    return { todos: docs, page: currentPage, pages: totalPages, totalPosts: totalDocs }
}


export const getPost = async (id: string, userId: string) => {

    const post = await Post.findOne({ _id: id, user: userId });
    if (!post) {
        throw new NotFoundError("post not found");
    }
    return post;
}


export const updatePost = async (id: string, userId: string, title: string, body: string) => {
    let post = await Post.findOne({ _id: id, user: userId });
    if (!post) {
        throw new NotFoundError("post not found");  
    }

    if (title) {
        post.title = title;
    }
    if (body) {
        post.body = body;
    }

    await post.save();
    return post;
}

export const deletePost = async (id: string, userId: string) => {
    const post = await Post.findOne({ _id: id, user: userId });
    if (!post) {
        throw new NotFoundError("post not found");
    }

    await post.remove();
    return "post deleted successfully"
}