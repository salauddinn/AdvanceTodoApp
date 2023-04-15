import { PaginateOptions } from "mongoose";
import { UserDocument } from "../user/UserModal";
import { Todo } from "./TodoModal";
import { NotFoundError } from "../../errors/NotFoundError";

export const saveTodo = async (userid: string, content: string, completed: boolean) => {
    const todo = new Todo({
        content,
        user: userid,
        completed,
    });

    await todo.save();
    return todo
}
export const getAlltodos = async (currentPage: number, pageSize: number, userid: string) => {
    const options = {
        page: currentPage,
        limit: pageSize,
        sort: { createdAt: -1 },
    };
    const { docs, totalDocs, totalPages } = await Todo.paginate({ user: { $ne: userid } }, options as PaginateOptions)
    return { todos: docs, page: currentPage, pages: totalPages, totalTodos: totalDocs }
}
export const getTodo = async (id: string, userId: string) => {
    const todo = await Todo.findOne({ _id: id, user: { $ne: userId } });
    if (!todo) {
        throw new NotFoundError("todo not found");
    }
    return todo;
}


export const updateTodo = async (id: string, userId: string, content: string, completed: boolean) => {
    let todo = await Todo.findOne({ _id: id, user: userId });
    if (!todo) {
        throw new NotFoundError("todo not found");
    }

    if (content) {
        todo.content = content;
    }
    if (completed !== undefined) {
        todo.completed = completed;
    }

    await todo.save();
    return todo;
}

export const deleteTodo = async (id: string, userId: string) => {
    const todo = await Todo.findOne({ _id: id, user: userId });
    if (!todo) {
        throw new NotFoundError("todo not found");
    }

    await todo.remove();
    return "Todo deleted successfully"
}