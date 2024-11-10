import { ExtraReq } from "../../type";
import { Response } from "express";
import sanitize from "sanitize-html";
import client from "../../db/Radis";


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