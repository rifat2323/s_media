import mongoose,{Document}  from "mongoose";

interface IUSER extends Document{
    name: string;
    email: string;
    password: string;
    role: "user" | "admin" | "super-admin" | "demo-admin";
    profilePicture?: string;
    bio?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
   
   
    createdAt?: Date;
    updatedAt?: Date;
    FriendLimit?:number;
    CoverPhoto?:string

}

const userSchema = new mongoose.Schema<IUSER>({
    name: {
        type: String,
        required: [true,"name is required"],
        trim:true,
        maxLength: [20, "name can not be more than 20 characters"],
        minLength: [3, "name can not be less than 3 characters"],
        index:true
        
    },
    email: {
        type: String,
        required: true,
        
        unique:true,
        lowercase:true,
        trim:true
        
    },
    password: {
        type: String,
        required:true
      

    },
    role:{
        type:String,
        default:'user'

    },
    profilePicture: {
        type: String, 
        default: "",  
    },
    bio: {
        type: String,
        maxLength: [500, "Bio must be less than 500 characters"], 
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        postalCode: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
    },
    FriendLimit:{
        type:Number,
        default:300
    },
    CoverPhoto:{
        type:String,
        default:""
    }
   
  

},{timestamps:true,autoIndex:true})

const User = mongoose.model<IUSER>('User', userSchema)
export default User