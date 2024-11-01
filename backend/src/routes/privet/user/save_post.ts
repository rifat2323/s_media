
import Router from 'express-promise-router'
const router  = Router()
import { createSavePost,getSavePost } from '../../../Controls/save_post/Save_Post'
import authenticateUser from '../../../middlewares/authenticateUser'


// user_save/create?id = postid
router.get('/create',authenticateUser,createSavePost)
// user_save/get_save_post?page = number_of_page
router.get('/get_save_post',authenticateUser,getSavePost)










export default  router