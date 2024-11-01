import Router from 'express-promise-router'
const router  = Router()
import authenticateUser from '../../../middlewares/authenticateUser'
import { getFriendList,getFriendSuggestion,getFriend,sendFriendRequest,acceptFriendRequest,isMyFriend ,getPendingFriendList,RemoveAsFriend} from '../../../Controls/user_friend/friend'
import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 60 * 60 * 1000, 
	limit: 600, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
	
})
const listLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, 
	limit: 200, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
	
})
//  /user_friend/get_friend_list

router.get('/get_friend_list',[listLimiter,authenticateUser],getFriendList)


//  /user_friend/get_friend?page=

router.get('/get_friend',[listLimiter,authenticateUser],getFriend)


//  /user_friend/get_friend_suggestion?page=

router.post('/get_friend_suggestion',[listLimiter,authenticateUser],getFriendSuggestion)

//  /user_friend/send_friend_request?friendId=

router.get('/send_friend_request',[listLimiter,authenticateUser],sendFriendRequest)

//  /user_friend/accept_friend_request?friendId=

router.get('/accept_friend_request',[listLimiter,authenticateUser],acceptFriendRequest)

//  /user_friend/is_my_friend?friendId=
router.get('/is_my_friend',[limiter,authenticateUser],isMyFriend)


//  /user_friend/get_friend_pending_list?cursor=
router.get('/get_friend_pending_list',authenticateUser,getPendingFriendList)


//  /user_friend/remove_friend?friendId=
router.get("/remove_friend",authenticateUser,RemoveAsFriend)



export default router