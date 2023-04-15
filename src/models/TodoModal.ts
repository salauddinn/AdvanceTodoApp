import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const todoSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            allowEmpty: false
        },
        date: {
            type: Date,
            default: Date.now
        },
        completed: {
            type: Boolean,

        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

todoSchema.plugin(paginate);



interface TodoDocument extends mongoose.Document {
    content: string,
    date: Date
    completed: boolean,
    user: mongoose.Schema.Types.ObjectId,
}
const Todo = mongoose.model<TodoDocument, mongoose.PaginateModel<TodoDocument>>('Todo', todoSchema);

export { Todo, TodoDocument };

