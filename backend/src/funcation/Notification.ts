import { Server } from "socket.io"

export const NotifySoket = (postId:string,userName:string,userImg:string,type:"liked"|"comment"|"f_request",commenterId:string,posterId:string,io:Server)=>{
    return
    console.log("notify")
    io.to(posterId).emit("new_notification",{
      postId:postId,
      commenterName:userName,
        commenterImg:userImg,
        type:type
        ,
        commenterId:commenterId,
        posterId:posterId
  
    })
    }