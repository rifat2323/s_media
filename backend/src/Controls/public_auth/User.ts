import { createUsers, loginJoiSchema } from "../../JoiType";
import User from "../../models/User";
import { Request,Response } from "express"
import sanitizeHtml from "sanitize-html"
import bcrypt from "bcrypt";
import  createJwt  from "../../funcation/CreateJwt";


   export const LoginUserFn = async (req: Request, res: Response) => {
    
       
        const email = sanitizeHtml(req.query.email as string);
        const password = sanitizeHtml(req.query.password as string);
        if(!email || !password){
            return res.status(400).send("All fields are required")
        }

       
        const { error, value } = loginJoiSchema.validate({ email, password });
        if (error) {
            return res.status(400).send(error?.message);
        }

       
        const findUser = await User.findOne({ email: value.email }).lean();
        if (!findUser) {
            return res.status(404).send("User not found");
        }

      
        const isMatch = await bcrypt.compare(value.password, findUser.password);
        if (!isMatch) {
            return res.status(404).send("Password does not match");
        }

       
        const [access_token, refresh_token] = await Promise.all([
            createJwt({ user_id: findUser._id,user_name:findUser.name,user_img:findUser.profilePicture,friend_limit:findUser.FriendLimit }, "access_token"),
            createJwt({ user_id: findUser._id,user_name:findUser.name,user_img:findUser.profilePicture,friend_limit:findUser.FriendLimit }, "refresh_token")
        ]);

     
        res.cookie("access_token", access_token, { maxAge: 1000 * 60 * 60 * 24 });
        res.cookie("refresh_token", refresh_token, { maxAge: 1000 * 60 * 60 * 24 });
        return res.status(200).json({ login: true, cookieSend: true,user:{id:findUser._id,name:findUser.name,img:findUser.profilePicture,coverPhoto:findUser.CoverPhoto}});

   
};


export const createUser = async (req:Request, res:Response) => {
    
   
    const name =sanitizeHtml( req.body.name as string)
    const email = sanitizeHtml(req.body.email as string)
    const password =sanitizeHtml( req.body.password as string)
    if(!name || !email || !password){
        return res.status(400).send("All fields are required")
    }
     
    const {error,value} = createUsers.validate({name,email,password})
    if(error){
        return res.status(400).send(error?.message)
    }

 

    const [findUser, hashedPassword] = await Promise.all([
        User.findOne({ email: value.email }).lean(),
        bcrypt.hash(value.password, 8) 
    ]);
    if(findUser){
        return res.status(400).send("User already exist")
    }
  
    const create = await User.create({
        name:value.name,
        email:value.email,
        password:hashedPassword
    })
    return res.status(200).json(create)


 

}








