import Router from 'express-promise-router'
import authenticateUser from '../../../middlewares/authenticateUser';
import { getUserFriend, getUserPost, getVisit } from '../../../Controls/user_visit/Visit';


const router = Router()

 router.use(authenticateUser)
// /visit_profile/visit_user?userId=
router.get('/visit_user',getVisit)
// /visit_profile/visit_user_post?userId= & cursor =
router.get('/visit_user_post',getUserPost)

// /visit_profile/visit_user_friend?userId= & cursor =
router.get('/visit_user_friend',getUserFriend)


export default router