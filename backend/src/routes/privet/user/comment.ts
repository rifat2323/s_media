import Router  from 'express-promise-router'
import { CreateComment,PatchComment,getMostCommentedPost,getComment,getCommentCount,deleteComment, s } from '../../../Controls/user_comment/comment'
const router  = Router()
import authenticateUser from '../../../middlewares/authenticateUser'
import {rateLimit} from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, 
	limit: 30, 
	standardHeaders: 'draft-7', 
	legacyHeaders: false, 
	
})
// /user_comment/create_comment
//take two body comment,postId
// one query posterId that can be found on post
router.post("/create_comment",[limiter,authenticateUser],CreateComment)

// /user_comment/update_comment
//take two body comment,postId
router.get("/update_comment",[limiter,authenticateUser],PatchComment)

// /user_comment/get_popular_comment_post?cursor=rnd || null
router.get('/get_popular_comment_post',authenticateUser,getMostCommentedPost)


// /user_comment/get_comment?postId=&cursor=rnd || null
router.get('/get_comment',authenticateUser,getComment)

// /user_comment/get_comment_count?postId=
router.get('/get_comment_count',authenticateUser,getCommentCount)


// /user_comment/delete_comment?commentId=
router.delete('/delete_comment',[limiter,authenticateUser],deleteComment)

router.get('/ss',s )

export default router