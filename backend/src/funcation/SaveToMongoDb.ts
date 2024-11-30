import Message from "../models/Message"
import Friend from "../models/Friend";
interface newMessage {
    sender: string;
    receiver: string;
    Message: string;
    sendTime: Date;
}
export const saveToDb = async (data:newMessage[])=>{
    try{

        await Message.insertMany(data,{ordered:false})
    }catch(error){
        console.log(error)
    }
    

}


export const updateBothFriend = async (Fdata:{lastMessage:string,lastMessageSenderId:string,lastMessageTimestamp:Date},Ids:string)=>{
   const {user,friend} = getID(Ids)
 try{
    await Friend.bulkWrite([
        {
            updateOne:{
                filter:{userId:user,FriendId:friend},
                update:{
                    lastMessage:Fdata.lastMessage,
                    lastMessageSenderId:Fdata.lastMessageSenderId,
                    lastMessageTimestamp:Fdata.lastMessageTimestamp
                }
            },
            

        },
        {
            updateOne:{
                filter:{userId:friend,FriendId:user},
                update:{
                    lastMessage:Fdata.lastMessage,
                    lastMessageSenderId:Fdata.lastMessageSenderId,
                    lastMessageTimestamp:Fdata.lastMessageTimestamp
                }
            },
            

        },
    ])

 }catch(error){
     console.log(error)
 }
}
function getID(id:string){
    const a = id.split(":")[1].toString().split('_')
    return {
        user:a[0],
        friend:a[1]
    }
}

