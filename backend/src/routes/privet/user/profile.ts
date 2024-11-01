import Router from 'express-promise-router'
import authenticateUser from '../../../middlewares/authenticateUser'
import { getUserProfile,ProfilePictureUpload,UpdloadCoverPhoto,getUserPost,getUserFriend } from '../../../Controls/user_profile/profile'
import multer from 'multer'
import path from "path";
import * as fs from 'node:fs'
import { rateLimit } from 'express-rate-limit'


const router  = Router()
const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        const uploadPath = path.resolve(__dirname,'..','..','..','upload')
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename(_req, file, cb) {
        cb(null,Date.now()+file.originalname)
        
    },
})


const UploadImageLimiter = rateLimit({
	windowMs: 24*60 * 60 * 1000, // 15 minutes
	limit: 2, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	
})
const upload = multer({storage:storage}).single('image')
router.use(authenticateUser)

//  /user_profile/get_profile_info
router.get('/get_profile_info',getUserProfile)

// /user_profile/uploadProfile_image
router.post('/uploadProfile_image',[upload,UploadImageLimiter],ProfilePictureUpload)


// /user_profile/uploadCover_photo
router.post('/uploadCover_photo',upload,UpdloadCoverPhoto)

// /user_profile/user_post/get_user_post
router.get("/user_post/get_user_post",getUserPost)

// /user_profile/get_user_friend
router.get('/get_user_friend',getUserFriend)

export default router