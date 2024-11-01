import { Document, Schema, model } from 'mongoose';
import User from './User';

interface IPost extends Document {
   
    mediaUrl?: string; 
 
    createdAt: Date; 
    userId:Schema.Types.ObjectId;
    textContent?: string;
}


const PostSchema: Schema = new Schema<IPost>({
   
    userId:{
        type:Schema.Types.ObjectId,
        ref:User,
        

    },
    
    mediaUrl: {
        type: String,
        
    },
    textContent:String,
   
    createdAt: {
        type: Date,
        default: Date.now, 
    },
},{timestamps:true,autoIndex:true});


const Stories = model<IPost>('Stories', PostSchema);
export default Stories;