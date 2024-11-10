import Router from 'express-promise-router';
import authenticateUser from '../../../middlewares/authenticateUser';
import { SearchPost, SearchUser } from '../../../Controls/user_Search/Search';




const router = Router()

// /user_search/search_user?keyword=
router.get('/search_user',authenticateUser,SearchUser)

// /user_search/search_post?keyword=
router.get('/search_post',authenticateUser,SearchPost)










export default router