import { Document,model,Schema,ObjectId } from "mongoose";
import User from "./User";

interface Friend extends Document{
  sender:ObjectId,
  receiver:ObjectId,
  Message:string
 createdAt:Date;
 sendTime:Date
    
}

const fr = new Schema<Friend>({
    sender: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
        index:true
    },
    receiver:{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
        index:true
    },
    Message:{
        type:String,
        index:true
    },
    sendTime:Date
    
},{timestamps:true,autoIndex:true});
const Message = model<Friend>('Message', fr);
export default Message;


