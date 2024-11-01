import Router from "express-promise-router";
import authenticateUser from "../../../middlewares/authenticateUser";
import { getNotification,getUserNotification } from "../../../Controls/user_notification/notification";

const router = Router()
router.use(authenticateUser)


// /user_notification/get_notification?cursor= 
router.get('/get_notification',getNotification)

// /user_notification/get_friend_req_notification?userId= 
router.get('/get_friend_req_notification',getUserNotification)



export default router