import { Document, Schema, model } from 'mongoose';
import User from './User';

interface IPost extends Document {
   
    textContent?: string; 
    mediaUrl?: string; 
 
    createdAt: Date; 
    userId:Schema.Types.ObjectId;
    fileId?:string
}

const PostSchema: Schema = new Schema<IPost>({
   
    userId:{
        type:Schema.Types.ObjectId,
        ref:User,
        

    },
    textContent: {
        type: String,
       
    },
    mediaUrl: {
        type: String,
        
    },
   
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    fileId:String
},{timestamps:true,autoIndex:true});


const Post = model<IPost>('Post', PostSchema);
export default Post;
