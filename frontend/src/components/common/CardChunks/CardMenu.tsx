
import axios from 'axios';
import { Save, Trash } from 'lucide-react';
import { Code } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useContext } from 'react';
import { CardContext } from '@/context/CardCOntext';
import deleteData from '@/utils/fecthing/DeleteData';


const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'
const CardMenu = ({id,poserId,postId}:{id:string,poserId:string,postId:string}) => {
  const {userInfo} = useContext(CardContext)
  const {toast} = useToast()
  const HandelDeletePost = async()=>{
    const {error,response} = await deleteData(`userpost/delete_post?post_id=${postId}`)
    if(response?.status === 200){
      toast({
        title:"Deleted Post",
        duration:1000,
        variant:"destructive"
      })
    }else if(error){
      toast({
        title:error?.response?.data,
        duration:1000,
        variant:"destructive"
      })
    }

  }
  const handelClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
    e.stopPropagation()

  }
  const [loadingSave,setLoadingSave] = useState(false)

  const handelSave = async ()=>{
    if(loadingSave) return
    setLoadingSave(true)
    try{
      const response  = await axios.get(`${partialUrl}/user_save/create?id=${postId}`,{
        withCredentials:true
      })
      if(response.status ===200){
        toast({
          title:"Saved"
        })
        setLoadingSave(false)
      }
    }catch(error){
      toast({
        title:"Already Saved"
      })
      setLoadingSave(false)
      console.log(error)
    }
  }
  return (
    <div onClick={handelClick} className=' bg-white p-3  z-10 absolute  top-7 right-0 w-[190px] h-fit overflow-y-auto border rounded-md shadow-md
    
     flex justify-center items-center flex-col gap-2'>
       <div className=' hover:bg-gray-200 px-2 py-1 rounded-md select-none cursor-pointer opacity-90 hover:opacity-100 transition-all flex w-full  gap-2 justify-center items-center '>
        <Save/>
        <div onClick={handelSave} className={cn(' flex w-full  justify-center items-start  flex-col',{
          "opacity-20":loadingSave,
            "cursor-wait":loadingSave

        })}>
            <p className=' text-zinc-950 font-semibold text-base'>Bookmark Post</p>
            <p   className={cn(' text-zinc-950 font-normal text-sm',{
              
            })}>save this post</p>

        </div>

       </div>
       <div className=' hover:bg-gray-200 rounded-md py-3 px-2  select-none opacity-90 hover:opacity-100 transition-all cursor-pointer  flex w-full gap-2  justify-center items-center '>
        <Code/>
        <div className='  flex w-full  justify-center items-start gap-1 flex-col'>
            <p className=' text-zinc-950 font-semibold text-base'>Embed code</p>
      
      

        </div>
        
        

       </div>
       {
        userInfo.id === poserId &&(
          <div onClick={()=>HandelDeletePost} className='  hover:bg-red-200 rounded-md py-3 px-2  select-none opacity-90 hover:opacity-100 transition-all cursor-pointer  flex w-full gap-2  justify-center items-center '>
          <Trash/>
          <div className='  flex w-full  justify-center  items-start gap-1 flex-col'>
              <p className=' text-zinc-950 font-semibold text-base'>Delete post</p>
        
        
  
          </div>
          
          
  
         </div>

        )
       }
     
     

    </div>
  )
}

export default CardMenu