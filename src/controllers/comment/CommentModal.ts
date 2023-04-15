import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const commentSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            allowEmpty: false,
            unique: true,
            trim: true,
        },
        name: {
            type: String,
            required: true,
            allowEmpty: false
        },
        body: {
            type: String,
            required: true,
            allowEmpty: false
        },

        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

commentSchema.plugin(paginate);



interface CommentDocument extends mongoose.Document {
    email: string,
    body: string,
    name: string,
    user: mongoose.Schema.Types.ObjectId,
    post: mongoose.Schema.Types.ObjectId,
    createdAt: Date;
    updatedAt: Date;
}
const Comment = mongoose.model<CommentDocument, mongoose.PaginateModel<CommentDocument>>('Comment', commentSchema);

export { Comment, CommentDocument };

