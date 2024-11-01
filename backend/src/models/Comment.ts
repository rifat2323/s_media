import { Schema, Document, model } from 'mongoose';
import { ObjectId } from 'mongodb';
import User from './User';

interface IComment extends Document {
    postId: ObjectId;  
    userId: ObjectId;  
    content: string;   
    createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Comment = model<IComment>('Comment', CommentSchema);
export default Comment;
