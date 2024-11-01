import { cn } from "@/lib/utils";
import { Bell } from "lucide-react";
import { format} from 'date-fns'


const NotificationChunks = ({ profileImage, message, time,userName,type,postId }:{profileImage:string,message:string,time:string,userName:string,type:string,postId:string}) => {
 
    return (
      <div onClick={()=>{
        window.location.href = `/singlePost/${postId}`
        
      }} className={cn("flex items-center p-4 hover:bg-gray-200 rounded-lg cursor-pointer mb-3",{
        "bg-blue-200":type === "liked",
        "bg-green-200":type === "comment",
        "bg-purple-300":type === "f_request"
      })}>
        {/* Left: Profile Image */}
        <img
          src={profileImage}
          alt="profile"
          className="w-10 h-10 rounded-full mr-4"
        />
        
        {/* Middle: Notification Text */}
        <div className="flex-1">
          <h1 className=" font-semibold text-gray-900">{userName}</h1>
          <p className="text-gray-800">
            <span className="font-light text-gray-800">{message}</span>
          </p>
          <p className="text-sm text-gray-500">{format(new Date(time), ' MM/dd/yyyy hh:mm a')}</p>
        </div>
  
        {/* Right: Bell Icon */}
        <div className="text-gray-500">
          <Bell className="w-6 h-6  -rotate-12" />
        </div>
      </div>
    );
  };
  export default NotificationChunks