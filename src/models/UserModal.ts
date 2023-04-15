import mongoose from 'mongoose';
import paginate from 'mongoose-paginate-v2';



const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            allowNull: false,
            unique: true,
            trim: true,
           
          },
          password: {
            type: String,
            required: true,
            min: [6, 'Password must be at least 6'],


          },
    },
    { timestamps: true }
);

userSchema.plugin(paginate);

export interface UserDocument extends mongoose.Document {
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
  }

export const User = mongoose.model<UserDocument, mongoose.PaginateModel<UserDocument>>('User', userSchema);