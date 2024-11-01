import mongoose,{Document} from "mongoose"; 

import Post from './Post';
import User from "./User";

interface ISavePost extends Document{
    postId: mongoose.Types.ObjectId,
    userId: mongoose.Types.ObjectId
}


const post = new mongoose.Schema<ISavePost>({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Post,
        required: true,
        index:true
      
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true,
        index:true
    }

},{timestamps:true,autoIndex:true});

const SavePost  = mongoose.model<ISavePost>('SavePost', post);
export default SavePost;