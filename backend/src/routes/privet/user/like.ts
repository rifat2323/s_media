import Router  from 'express-promise-router'
import authenticateUser from '../../../middlewares/authenticateUser'
const router  = Router()
import { createOrUpdateLike ,getMostLikePost,getLike,getLikeCount,isLikedPost} from '../../../Controls/user_like/like'

// /user_like/create?posterId = userId&postId = postId
router.get('/create',authenticateUser,createOrUpdateLike)

// /user_like/get_popular_like_post?cursor = tn or null
router.get('/get_popular_like_post',authenticateUser,getMostLikePost)

// /user_like/get_like?cursor = tn or null&postId=
router.get('/get_like',authenticateUser,getLike)

// /user_like/get_like_count?postId=
router.get('/get_like_count',authenticateUser,getLikeCount)
// /user_like/is_liked?postId=
router.get('/is_liked',authenticateUser,isLikedPost)
export default router
