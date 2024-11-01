import { Document,model,Schema } from "mongoose";

interface Noti extends Document {
    postId?:string,
    commenterName:string,
    commenterImg:string,
    type:"liked" | "comment" | "f_request",
    commenterId:string,
    posterId:string,
    createdAt:Date

}


const not_Sch = new Schema<Noti>({

 postId:String,
 commenterName:String,
 commenterImg:String,
 type:{
    type:String,
    enum:["liked","comment","f_request"]
 },

 commenterId:String,
 posterId:String



},{timestamps:true})
const Notification  =   model<Noti>("Notification",not_Sch)

export default Notification