import Router  from 'express-promise-router'
import authenticateUser from '../../../middlewares/authenticateUser'
import { getActiveFriend,getLastMessageFriendList,get_conversation,getFriendStatus,getRecentMessage,FindOneFriend } from '../../../Controls/user_message/message'
const router  = Router()

router.use(authenticateUser)

// /message/get_active_friend?index=number
// take body of user_friend

router.post('/get_active_friend',getActiveFriend)


// /message/get_sort_message_friendList?cursor=rnd
router.get('/get_sort_message_friendList',getLastMessageFriendList)


// /message/get_conversation?cursor=rnd&text=rnd
router.get('/get_conversation',get_conversation)

// /message/get_friend_status?friendId=rnd
router.get('/get_friend_status',getFriendStatus)
// /message/get_message?friendId=rnd&cursor
router.get('/get_message',getRecentMessage)

// /message/one_friend?friendId=rnd
router.get("/one_friend",FindOneFriend)

export default router