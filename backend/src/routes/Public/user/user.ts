
import Router from "express-promise-router";
import { createUser,LoginUserFn,logOut } from '../../../Controls/public_auth/User';
import authenticateUser from "../../../middlewares/authenticateUser";

const router = Router()

// take three body parameters name,email,password
// {
//     "name": "John Doe",
//     "email": "john.doe@example.com",
//     "password": "securePassword123"
//   }
router.post('/register',createUser)



// take two query parameters email,password
// user/login?email=john.doe@example.com@&password=securePassword123
     
router.get('/login',LoginUserFn)

router.get('/logout',authenticateUser,logOut)



export default router 