import { Schema, Document, model } from 'mongoose';
import { ObjectId } from 'mongodb';

interface ILike extends Document {
    postId: ObjectId; 
    userId: ObjectId;  
    createdAt:Date;
    
}

const LikeSchema = new Schema<ILike>({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index:true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
    },
   
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{timestamps:true,autoIndex:true});

const Like = model<ILike>('Like', LikeSchema);
export default Like;
