import Router from 'express-promise-router'
import { createPost,getPostBody,getPost,deletePost } from '../../../Controls/user_post/Post'
import multer from 'multer'
import path from "path";
import * as fs from 'node:fs'
import authenticateUser from '../../../middlewares/authenticateUser';




const router = Router()
const storage =  multer.diskStorage({
    destination: (_req, _file, cb) => {
       
        const uploadPath = path.resolve(__dirname, '..', '..', '..', 'upload'); 

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename:(_req,file,cb)=>{
        cb(null,Date.now()+file.originalname)
    }
})
const upload  = multer({storage:storage}).single("image")

router.use(authenticateUser)


// /userpost/create

router.post('/create',upload,createPost)

// /userpost/get_post_body?cursor=rnd&random_cursor=rnd
// take body "friend" 

router.post('/get_post_body',getPostBody)


// /userpost/get_post?random_cursor=rnd
router.get('/get_post',getPost)

// /userpost/delete_post?post_id=r
router.delete('/delete_post',deletePost)

export default router