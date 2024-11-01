import { Document,model,Schema,ObjectId } from "mongoose";
import User from "./User";

interface Friend extends Document{
  userId:ObjectId,
  FriendId:ObjectId,
  status: "pending" | "approved" | "declined" | "blocked" | "b_friend",
   createdAt:Date;
    
}

const fr = new Schema<Friend>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
        index:true
    },
    FriendId:{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true,
        index:true
    },
    status:{
        type:String,
        enum:["pending","approved","declined","blocked","b_friend","send"],
        default:"pending"
    }
},{timestamps:true,autoIndex:true});
const Friend = model<Friend>('Friend', fr);
export default Friend;


