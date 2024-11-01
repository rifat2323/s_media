import Router from 'express-promise-router'
import authenticateUser from '../../../middlewares/authenticateUser'
import multer from 'multer'
import path from "path";
import * as fs from 'node:fs'
import { postStories ,getStories} from '../../../Controls/user_stories/stories';

const router = Router()



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
const upload = multer({storage:storage}).single('image')
// /user_stroies/create_story
router.post('/create_story',[authenticateUser,upload],postStories)


// /user_stroies/get_stories?cursor=rnd&storiesId?=rnd
router.get("/get_stories",authenticateUser,getStories)


export default router