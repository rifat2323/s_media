import { Response } from "express";

import { ExtraReq } from "../../type";
import Friend from "../../models/Friend";
import sanitize from "sanitize-html";
import User from "../../models/User";
import Notification from "../../models/Notification";

/**
 * Retrieves a list of friends for a user.
 * @param req - An Express request object containing the user's ID.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with the list of friends if successful, or a 404 status code with an error message if the friend list is not found.
 */
export const getFriendList = async (req:ExtraReq,res:Response)=>{
    const id  = req.userId


    const friendList = await Friend.find({userId:id,status:"approved"}).select("FriendId -_id").sort({createdAt:-1}).lean()
    if(friendList.length ===0){
        return res.status(404).send("friend list not found")
    }
    return res.status(200).json(friendList)

}

/**
 * Retrieves a list of friends for a user, paginated.
 * @param req - An Express request object containing the user's ID and the page number.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with the list of friends if successful, or a 404 status code with an error message if the friend list is not found.
 */
export const getFriend = async (req:ExtraReq,res:Response)=>{
    const id  = req.userId
    const page  =sanitize( req.query.page as string )

    if(!page || parseInt(page) < 0 || isNaN(parseInt(page))){
        return res.status(400).send("invalid page number")
    }

    const pages = parseInt(page) || 0


    const friend = await Friend.find({userId:id}).skip(20*pages).limit(20).sort({createdAt:-1}).lean()
    if(friend){
        return res.status(404).send("friend list not found")
    }
    return res.status(200).json(friend)

}

/**
 * Retrieves a list of friend suggestions for a user, paginated.
 * @param req - An Express request object containing the user's ID and the page number.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with the list of friends if successful, or a 404 status code with an error message if the friend list is not found.
 */

//have to set $nin later so that it wouldn't return the user friend
// we will save friend array in user browser local storage
export const getFriendSuggestion = async (req:ExtraReq,res:Response)=>{
    const id  = req.userId
    const page  =sanitize( req.query.page as string )
     console.log(id)
    if(!page || parseInt(page) < 0 || isNaN(parseInt(page))){
        return res.status(400).send("invalid page number")
    }
    const {user_friend} = req.body
   
    const pages = parseInt(page) || 0

    const friendIds = Array.isArray(user_friend) && user_friend.length > 0
    ? user_friend.map(friend => friend.FriendId)
    : [];
    const suggestFriend = await User.find({_id:{$nin:[id,...friendIds]}}).skip(20*pages).limit(20).select(" _id name profilePicture").sort({createdAt:-1}).lean()
    if(suggestFriend.length ===0){
        return res.status(404).send("friend list not found")
    }
    return res.status(200).json(suggestFriend)

}


/**
 * Sends a friend request to a user.
 * @param req - An Express request object containing the user's ID and the friend's ID.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with the newly created friend request if successful, or a 400 status code with an error message if the friend limit is reached or if the friend ID is missing, or a 404 status code with an error message if the friend request is not created.
 */
export const sendFriendRequest = async (req:ExtraReq,res:Response)=>{
    const id  = req.userId
    const friendLimit = req.friendLimit
    const friendId  = sanitize( req.query.friendId as string )
      
    if(!friendId){
        return res.status(400).send("a  friendId is required")
    }
   const [isAlreadyFriend,totalFriend,isPending] = await Promise.all([
        Friend.findOne({userId:id,FriendId:friendId,status:"approved"}).lean(),
     
        Friend.countDocuments({userId:id}).lean(),
        Friend.exists({userId:id,FriendId:friendId,status:"pending"}).lean()
    ])
   if(isAlreadyFriend){
       return res.status(400).send("already friend")
   }
   if(totalFriend >= friendLimit!){
       return res.status(400).send("friends limit reached")
   }
   
   if(isPending){
    const friendNew =await Friend.bulkWrite([
        {
          updateOne: {
            filter: { userId: id, FriendId: friendId },
            update: { $set: { status: "approved" } },
           
          }
        },
        {
          updateOne: {
            filter: { userId: friendId, FriendId: id },
            update: { $set: { status: "approved" } },
           
          }
        }
      ])
    if (friendNew.modifiedCount !== 2) {
        return res.status(404).send("Friend request not created");
    }
 return res.status(200).json(friendNew)

   }
    try{
        const friendNew = await Friend.insertMany(
            [
                {
                    userId:id,
                    FriendId:friendId,
                    status:"send"
                },
                {
                    userId:friendId,
                    FriendId:id,
                    status:"pending"
                }
            ]
        )
        await Notification.create({ 
            postId:'',
           commenterName:'',
           commenterImg:'',
           type:"f_request",
           posterId:id,
           commenterId:friendId
         })

        if (!friendNew || friendNew.length === 0) {
            return res.status(404).send("Friend request not created");
        }
     return res.status(200).json(friendNew)

    }catch(error){
        console.log(error)
        return res.status(500).send("server error")
    }
    

}


/**
 * Accepts a friend request from a user.
 * @param req - An Express request object containing the user's ID and the friend's ID.
 * @param res - An Express response object to send the result of the operation.
 * @returns A 200 status code with the message "approved" if the friend request is accepted, or a 400 status code with an error message if either the friend ID is missing or if the friend limit is reached.
 */
export const acceptFriendRequest = async (req:ExtraReq,res:Response)=>{
    const id  = req.userId
    const friendLimit = req.friendLimit
    const friendId  = sanitize( req.query.friendId as string )
  
    if(!friendId){
        return res.status(400).send("a  friendId is required")
    }
    const totalFriend = await Friend.countDocuments({userId:id})
    if(totalFriend >= friendLimit!){
        return res.status(400).send("friends limit reached")
    }

    

   

    const updateResults = await Promise.all([
        Friend.updateOne({ userId: id, FriendId: friendId }, { status: "approved" }),
        Friend.updateOne({ userId: friendId, FriendId: id }, { status: "approved" })
    ]);

    // Log if records were not matched
    if (updateResults.some(result => result.matchedCount === 0)) {
        console.log("Warning: One or more friend records were not matched after update.");
    }

        
        
     return res.status(200).json({approved:true})
}




export const isMyFriend = async (req:ExtraReq,res:Response)=>{

    const id = req.userId
    const friendId = sanitize(req.query.friendId as string)
    const isFriend = await Friend.exists({userId:id,FriendId:friendId}).lean()
    if(!isFriend){
        return res.status(404).json({isFriend:false})
    }
    return res.status(200).json({isFriend:true})
}


export const getPendingFriendList = async (req:ExtraReq,res:Response)=>{

    const id = req.userId
    const cursor = sanitize(req.query.cursor as string)
    const query = cursor ? {userId:id,status:"pending",createdAt:{$lt:cursor}}:{userId:id,status:"pending"}
    const pendingFriendList = await Friend.find(query).select("FriendId createdAt ").sort({createdAt:-1}).populate({
      path:"FriendId",
      select:"_id name profilePicture"  
    }).lean()
    if(pendingFriendList.length ===0){
        return res.status(408).send("pending friend list not found")
    }
    const sendCursor = pendingFriendList.length > 0 ? pendingFriendList[pendingFriendList.length - 1].createdAt : null
    return res.status(200).json({pendingFriendList,sendCursor})
}
export const RemoveAsFriend = async (req:ExtraReq,res:Response)=>{

    const id = req.userId
    const FriendId = sanitize(req.query.friendId as string)
   
     const multipleDelete = await Friend.deleteMany({$or:[{userId:id,FriendId:FriendId},{userId:FriendId,FriendId:id}]})
     if(multipleDelete.deletedCount === 0){
         return res.status(400).json({deleted:false})
     }
  
    return res.status(200).json({deleted:true})
}