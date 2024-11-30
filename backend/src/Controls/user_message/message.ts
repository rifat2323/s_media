import { ExtraReq } from "../../type";
import { Response } from "express";
import sanitize from "sanitize-html";
import client from "../../db/Radis";
import Friend from "../../models/Friend";
import Message from "../../models/Message";
import User from "../../models/User";
import mongoose from "mongoose";
import { Server, Socket } from "socket.io";

import universelCookie from 'universal-cookie'
import verifyJwt from "../../funcation/VerifyJwt";
import { saveToDb, updateBothFriend } from "../../funcation/SaveToMongoDb";


export const getActiveFriend = async (req: ExtraReq, res: Response) => {
    const {user_friend} = req.body
    const index = sanitize(req.query.index as string) 
    if(isNaN(parseInt(index))){
        return res.status(400).send("invalid index")
    }
    let number = parseInt(index) || 1


    const friendIds = Array.isArray(user_friend) && user_friend.length > 0
    ? user_friend.map(friend => sanitize(friend.FriendId))
    : [];
    const activeFriend = await client.mGet(friendIds)
    const activeFriends = friendIds
            .map((_friendId, i) => {
                const value = activeFriend[i];
                return value !== null ? {  value: JSON.parse(value) } : null;
            })
            .filter(friend => friend !== null);
    const start = number - 1 * 10
    const end = start + 10

    const sendactiveFriend = activeFriends.slice(start, number + end)
    return res.status(200).json(sendactiveFriend)
 
}

export const getLastMessageFriendList = async (req: ExtraReq, res: Response) => {
    const id = req.userId
    const cursor = req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null
    const query = cursor ? {userId:id,createdAt:{$lt:cursor}}:{userId:id}

  const friendList = await Friend.find(query).select("FriendId lastMessageTimestamp lastMessage  lastMessageSenderId").limit(30).sort({lastMessageTimestamp:-1}).populate({path:"FriendId",select:"_id name profilePicture"}).lean()
  if(friendList.length === 0) {
    return res.status(404).send("no friend found")
 }
  const friendIds = friendList.map(friend => {
    const friendId =
        friend.FriendId && typeof friend.FriendId === "object" && "_id" in friend.FriendId
            ? (friend.FriendId as any)._id.toString()
            : friend.FriendId?.toString();
    return friendId;
});

  const activeStatuses = await Promise.all(
    friendIds.map(async friendId => {
        const isActive = await client.exists(friendId); // Returns 1 if active, 0 if not
        return { friendId, isActive: isActive === 1 };
    })
); 
const friendListWithStatus = friendList.map(friend => {
    const status = activeStatuses.find(
        status => status.friendId === (friend.FriendId as any)._id.toString()
    );
    return {
        ...friend,
        isActive: status ? status.isActive : false,
    };
});

  const nextCursor = friendList.length ? friendList[friendList.length - 1].lastMessageTimestamp : null;
  return res.status(200).json({friendList:friendListWithStatus,nextCursor})




}


export const get_conversation = async (req: ExtraReq, res: Response) => {
  const text = sanitize( req.query.text as string)
  const cursor = req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null
   if(!text || text.trim().length === 0) return res.status(400).send("text is required")
  const query = cursor ? {Message:{$regex:text,$options:"i"},createdAt:{$lt:cursor}}:{Message:{$regex:text,$options:"i"}}
    const friends = await Message.find(query).sort({createdAt:-1}).limit(30).populate("sender _id name profilePicture").lean()
     if(friends.length === 0) return res.status(404).send("conversation not found")
    const nextCursor = friends.length ? friends[friends.length - 1].createdAt : null;
    return res.status(200).json({friends,nextCursor})

}



export const getFriendStatus = async (req: ExtraReq, res: Response) => {
 const friendId = sanitize(req.query.friendId as string)
 if(!friendId) return res.status(400).send("friendId is required")
    if(!mongoose.Types.ObjectId.isValid(friendId)) return res.status(400).send("invalid friendId")

    const user = await User.findById(friendId).select("_id name profilePicture").lean()
    if(!user) return res.status(404).send("user not found")
    const isActive = await client.exists(friendId); 
     
    return res.status(200).json({user,isActive})

}

export const getRecentMessage = async (req: ExtraReq, res: Response) => {

    const friendId = sanitize(req.query.friendId as string)
    const userId = req.userId
    const cursor = req.query.cursor !== "null" ? sanitize(req.query.cursor as string) : null
    if(!friendId) return res.status(400).send("friendId is required")
    if(!mongoose.Types.ObjectId.isValid(friendId)) return res.status(400).send("invalid friendId")
        const query = cursor ? {$or:[{sender:friendId,receiver:userId},{sender:userId,receiver:friendId}],sendTime:{$lt:cursor}}:{$or:[{sender:friendId,receiver:userId},{sender:userId,receiver:friendId}]}
    const messages = await Message.find(query).sort({sendTime:-1}).limit(30).lean() 
   if(messages.length === 0) return res.status(404).send("messages not found")
    const sendCursor =  messages.length > 0 ? messages[messages.length - 1].sendTime : null
  /*  const sortedMessages = messages.reverse(); */
    return res.status(200).json({messages,sendCursor})
}




export const FindOneFriend = async (req: ExtraReq, res: Response) => {

    const friendId = sanitize(req.query.friendId as string)
    const friendList = await Friend.findOne({userId:req.userId,FriendId:friendId}).select("FriendId lastMessageTimestamp lastMessage  lastMessageSenderId").populate({path:"FriendId",select:"_id name profilePicture"}).lean()
    if(!friendList) return res.status(404).send("friend not found")

    return res.status(200).json(friendList)
} 




type message ={
    FriedId:string,
    
    Message:string,
    room:string
 
   
}


export const send_and_receive_message = (socket:Socket,rawCookie:string,io:Server )=>{
    const parseCookie = new universelCookie(rawCookie)
    const refresh_token = parseCookie.get('refresh_token')
    const {data} = verifyJwt(refresh_token, "refresh_token");
     socket.on("joinRoom",(friendId:string)=>{
        const sort = [friendId,data.user_id].sort().join("_").toString()
        console.log("Socket attempting to join room:", {
            socketId: socket.id,
            sort,
          });
        socket.join(sort)
       
        socket.emit("joinedRoom",sort)
       
     })
     socket.on("send_message", async (message:message)=>{
        const expectedRoom = [message.FriedId, data.user_id].sort().join("_").toString();
        if (message.room !== expectedRoom) {
            return socket.emit("error", "Invalid room");
        }
        io.to(message.FriedId).emit("update_friend_list",{user_id:data.user_id,message:message.Message})
       
       const newMessage ={
        sender:data.user_id,
        receiver:message.FriedId,
        Message:message.Message,
       
        sendTime:new Date()

       }
        io.to(message.room).emit("receive_message",newMessage)
       const roomKey = `room:${message.room}:messages`;
       const updateTimeKey = `time:${message.room}`;
       await client.set(updateTimeKey,JSON.stringify({lastMessage:newMessage.Message,lastMessageSenderId:newMessage.sender,lastMessageTimestamp:newMessage.sendTime}))
       await client.rPush(roomKey, JSON.stringify(newMessage));
       await client.expire(roomKey, 28800);
      
      return

     })

     socket.on("leaveRoom", async(friendId:string)=>{
        console.log('user:',data.user_id,"disconnect from room:",friendId)
        const sort = [friendId, data.user_id].sort().join("_").toString();
        const roomKey = `room:${sort}:messages`;
        const updateTimeKey = `time:${sort}`;
        const messages = await client.lRange(roomKey, 0, -1);
        const parsedMessages = messages.map((msg) => JSON.parse(msg));
        if(parsedMessages.length >0){
            await saveToDb(parsedMessages)

        }
       
        const Fdata = await client.get(updateTimeKey)
        console.log(Fdata)
        if(Fdata){

            await updateBothFriend(JSON.parse(Fdata as string ),updateTimeKey )
        }

       
        
        await client.del(roomKey);
        await client.del(updateTimeKey);

        socket.leave(sort);
     })
  
}