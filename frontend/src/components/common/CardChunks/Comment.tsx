import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import fetch_get_data from '@/utils/fecthing/GetData';
import { Ellipsis } from 'lucide-react';
import React, {  useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import deleteData from '@/utils/fecthing/DeleteData';
import { useToast } from '@/hooks/use-toast';
import { CardContext } from '@/context/CardCOntext';
import { useContext } from 'react';

interface CommentProps {
  image: string;
  name: string;
  comment: string;
  postId:string;
  commentId:string;
  userId:string
}

const Comment: React.FC<CommentProps> = ({ image, name, comment,postId,commentId,userId }) => {
    const [ref,inViw] = useInView({
        threshold:0
    })
    const {userInfo} = useContext(CardContext)
    const navigate = useNavigate()
    const [isAvtive,setIsAvtive] = useState(false)
   const [isEditMode,setIsEditMode] = useState(false)
   const [loading,setLoading] = useState(false)
   const [userComment,setUserComment] = useState(comment)
   const {toast} = useToast()
   const commentRef = useRef<HTMLInputElement | null>(null)
   const handelEditComment = async ()=>{
    if(loading) return
    if(!commentRef.current) return
    setLoading(true)
    const {response,error} = await fetch_get_data(`user_comment/update_comment?comment=${commentRef.current.value}&postId=${postId}&commentId=${commentId}`)
    
     if(response?.status === 200){
      setIsEditMode(false)
      setLoading(false)
      setUserComment(commentRef.current.value)
     }
     if(error?.status === 401){
      navigate('/login')
      setLoading(false)
     }
   }
   const handelDeleteComment =  async ()=>{
     const {response,error} =await deleteData(`user_comment/delete_comment?commentId=${commentId}`)
     if(response?.status === 200){
      toast({
        title:"comment deleted",
      
      })
      setIsAvtive(false)
      
     }
     if(error){
      toast({
        title:error?.response?.message,
      
      })
     }
   }
  return (
    <div onMouseLeave={()=>setTimeout(()=>setIsAvtive(false),600)} onClick={(e)=>e.stopPropagation()} ref={ref} className={cn("flex w-[450px] p-2 items-center justify-between  h-fit  border-b  py-2",{
        "h-11":!inViw
    })}>
      <div className=' flex-1  flex justify-start items-center gap-2'>

      
      {/* Left: User Image */}
      <div className={cn("mr-3",{
        "hidden":!inViw
      })}>
        <img
          src={image || "https://placehold.co/300x300"}
          alt={`${name}'s profile`}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>

      {/* Right: Name and Comment */}
     
    
     {
      isEditMode ? (
        <div className=' flex flex-col'>
          <input ref={commentRef} type="text" defaultValue={userComment} className='w-full border border-gray-300 rounded-md p-1' />
          <div className='flex justify-end w-full gap-3 mt-2'>
            <Button onClick={()=>setIsEditMode(false)} className=' bg-blue-500 text-white hover:bg-blue-600 h-fit'>Cancel</Button>
            <Button onClick={handelEditComment} className={cn(` bg-blue-500 text-white hover:bg-blue-600 h-fit`,{
              "cursor-not-allowed":loading,
              "bg-blue-300":loading
            })}>Save</Button>

          </div>
        </div>

      ):(
        <div className={cn("flex flex-col",{
          "hidden":!inViw
        })}>
          {/* Name */}
          <span className="font-semibold text-sm">{name}</span>
          {/* Comment */}
          <p className="text-sm text-gray-700">{userComment}</p>
        </div>
      )
     }


      </div>
      {
        userInfo.id === userId && (
          <div  className=' relative'>
          <Ellipsis  onClick={(e)=>{e.stopPropagation();setIsAvtive((prev)=>!prev)}}/>
          {
            isAvtive &&(
              <div className='flex flex-col gap-1 justify-center items-center  w-20 shadow-sm absolute top-6 right-0 bg-slate-50  py-2 z-10 '>
              <li onClick={()=>{
                setIsEditMode(true)
                setIsAvtive(false)
    
              }} className=' hover:bg-green-100  rounded-sm w-full text-center list-none '>Edit</li>
              <li onClick={handelDeleteComment} className=' hover:bg-red-100 rounded-sm w-full text-center list-none'>Delete</li>
      
            </div>
    
            )
          }
        
          </div>

        )
      }
   
    </div>
  );
};

export default Comment;
