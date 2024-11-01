

import Router from "express-promise-router";

import { getSingalePost,getSingaleLike,getSingaleComment } from "../../../Controls/public_post/post";


const router = Router()

// /public/post/:id
router.get('/post/:id',getSingalePost)

router.get("/post/likes/:id",getSingaleLike)
router.get("/post/comments/:id",getSingaleComment)






export default router