import { useRef,useState } from "react";
import { Textarea } from "@/components/ui/textarea"; // Assuming shadcn textarea is imported from here
import { Video, Image } from 'lucide-react';
import styles from './Home.module.css' 
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {ThreeDots} from 'react-loader-spinner'
import { useContext } from "react";
import { CardContext } from "@/context/CardCOntext";

const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'
const PostSection = () => {
  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
  };
  const {toast} = useToast()

  const txt_ref = useRef<HTMLTextAreaElement | null>(null);
  const picture_ref = useRef<HTMLInputElement | null>(null);
  const [loading,setLoading] = useState(false)
 const [pictureUrl,setPicturUrl] = useState<string | null>(null)

 const {userInfo} = useContext(CardContext)
 const handelPostSubmit = async ()=>{
   if(loading) return
 if(!txt_ref.current && !picture_ref.current) return


 const fromData = new FormData()
 if(picture_ref.current?.files?.[0]){
  fromData.append("image",picture_ref.current?.files?.[0])
  
 }
 if(txt_ref?.current){

   fromData.append("textContent",txt_ref.current.value)
 }
 setLoading(true)
  try{
    const response = await axios.post(`${partialUrl}/userpost/create`,fromData,{
      withCredentials:true
    })
    if(response.status === 201){
      setLoading(false)
      toast({
        description: "Post created successfully",
        
      })
    }
    console.log(response)

  }catch(error){
    console.log(error)
    toast({
      description: "Post is not created",
      
    })
    setLoading(false)
  }

 } 
 
  return (
    <div  onClick={handleClick} className={`  border  right-6 sm:translate-x-0  absolute top-14   z-20 bg-white p-4 shadow-md rounded-md w-[250px] sm:w-[450px]  md:w-[500px] mx-auto ${styles.card}`}>
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <img
          src={  userInfo.img||"https://via.placeholder.com/40"} // Replace with the user's image URL
          alt="User"
          className="w-10 h-10 rounded-full"
        />
        <span className="font-semibold">{userInfo.name}</span>
      </div>

      {/* Textarea Section */}
      <div className="mb-4">
        <Textarea
         ref={txt_ref}
          placeholder="What's on your mind?"
          className="w-full resize-none text-black  ring-0 ring-offset-0 "
          rows={4}
        />
      </div>

      {/* Bottom Section: Icons and Post Button */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-4">
          <Video className="text-gray-500 hover:text-blue-500 cursor-pointer" size={24} />
          <label htmlFor="file">
          <input onChange={(e)=> setPicturUrl(URL.createObjectURL(e.target.files?.[0] as Blob))} id="file" type="file" accept="image/*"  className="hidden" ref={picture_ref}/>
          <Image className="text-gray-500 hover:text-blue-500 cursor-pointer" size={24} />
          </label>
          
         
        
          
        </div>
        {
          pictureUrl &&(
            <img width={30} height={20} src={pictureUrl} alt="" />
          )
        }
       
        <button onClick={handelPostSubmit} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          {
            loading ? (
              <ThreeDots
              height={20}
              width={30}
              color="#fff"
              />
            ):"Post"
          }
       
        </button>
      </div>
    </div>
  );
};

export default PostSection;
