import Router  from 'express-promise-router'
import authenticateUser from '../../../middlewares/authenticateUser'
import { getActiveFriend } from '../../../Controls/user_message/message'
const router  = Router()

router.use(authenticateUser)

// /message/get_active_friend?index=number
// take body of user_friend

router.post('/get_active_friend',getActiveFriend)








export default router