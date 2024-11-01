import { Schema, Document, model } from 'mongoose';
import { ObjectId } from 'mongodb';
import User from './User';
interface ILike extends Document {
    postId: ObjectId; 
   
    createdAt:Date;
    LikeCount:number;
    posterId:ObjectId;
    commentCount:number
}


const likeCountShema_comment = new Schema<ILike>({
    postId: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: true,
        index:true
    },
    LikeCount:{
    type:Number,
    default:0,
    index:true
    },
    commentCount:{
        type:Number,
        default:0,
        index:true
    },
    posterId:{
        type:Schema.Types.ObjectId,
        ref:User,
        index:true
    },
   
    createdAt: {
        type: Date,
        default: Date.now,
    },
},{timestamps:true,autoIndex:true});

const LikeCommentSchema = model<ILike>('LikeCount', likeCountShema_comment);
export default LikeCommentSchema;

