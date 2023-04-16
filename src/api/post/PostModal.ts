import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';

const postSchema = new mongoose.Schema(
    {
        body: {
            type: String,
            required: true,
            allowEmpty: false
        },
        title: {
            type: String,
            required: true,
            allowEmpty: false
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

    },
    { timestamps: true }
);

postSchema.plugin(paginate);



interface PostDocument extends mongoose.Document {
    body: string,
    title: string,
    user: mongoose.Schema.Types.ObjectId,
    createdAt: Date;
    updatedAt: Date;
}
const Post = mongoose.model<PostDocument, mongoose.PaginateModel<PostDocument>>('Post', postSchema);

export { Post, PostDocument };

