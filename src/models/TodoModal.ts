import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const todoSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: true,
            allowEmpty: false
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
    completed: boolean,
    user: mongoose.Schema.Types.ObjectId,
    createdAt: Date;
    updatedAt: Date;
}
const Todo = mongoose.model<TodoDocument, mongoose.PaginateModel<TodoDocument>>('Todo', todoSchema);

export { Todo, TodoDocument };

