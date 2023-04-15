// import mongoose from 'mongoose';
// import paginate from 'mongoose-paginate-v2';

// const todoSchema = new mongoose.Schema(
//     {
//         content: {
//             type: String,
//             required: true,
//             allowEmpty: false
//         },
//         date: {
//             type: Date,
//             default: Date.now
//         },
//         completed:{
//             type: Boolean,

//         }
//     },
//     { timestamps: true }
// );

// todoSchema.plugin(paginate);



// interface TodoDocument extends mongoose.Document {
//     content: string,
//     date: Date
// }
// const Todo = mongoose.model<TodoDocument, mongoose.PaginateModel<TodoDocument>>('Todo', todoSchema);

// export { Todo, TodoDocument };

