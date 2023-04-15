import { PaginateOptions } from "mongoose";
import { UserDocument } from "../user/UserModal";
import { Comment } from "./CommentModal";
import { NotFoundError } from "../../errors/NotFoundError";

export const saveComment = async (email: string, name: string, body: string, postId: string, userId: string) => {
    const comment = new Comment({
        email,
        name,
        body,
        post: postId,
        user: userId,
    });

    await comment.save();


    return comment
}
export const getAllComments = async (currentPage: number, pageSize: number, postId: string) => {
    const options = {
        page: currentPage,
        limit: pageSize,
        sort: { createdAt: -1 },
    };
    const { docs, totalDocs, totalPages } = await Comment.paginate(
        { post: postId }, options as PaginateOptions);
    return { todos: docs, page: currentPage, pages: totalPages, totalComments: totalDocs }
}


export const getCommentById = async (id: string) => {

    const comment = await Comment.findOne({ _id: id });
    if (!comment) {
        throw new NotFoundError("comment not found");
    }
    return comment;
}


export const updateComment = async (id: string, userId: string, email: string,name:string, body: string) => {
    let comment = await Comment.findOne({ _id: id, user: userId });
    if (!comment) {
        throw new NotFoundError("comment not found");
    }

    if (email) {
        comment.email = email;
    }
    if (name) {
        comment.name = name;
    }
    if (body) {
        comment.body = body;
    }

    await comment.save();
    return comment;
}

export const deleteComment = async (id: string, userId: string) => {
    const comment = await Comment.findOne({ _id: id, user: userId });
    if (!comment) {
        throw new NotFoundError("comment not found");
    }

    await comment.remove();
    return "comment deleted successfully"
}