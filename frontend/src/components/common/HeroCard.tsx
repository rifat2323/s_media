
import {useRef,useEffect,useState,memo, Suspense, lazy, useContext} from 'react'

import { throttle } from 'throttle-debounce';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {  EllipsisVertical } from 'lucide-react';
import Imgix from "react-imgix";
import { ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MessageSquareMore } from 'lucide-react';
import { Forward } from 'lucide-react';
import { SendHorizontal } from 'lucide-react';
import{ format} from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useInView } from "react-intersection-observer";
import axios from 'axios';
import { CardContext } from '@/context/CardCOntext';
import { InView } from 'react-intersection-observer';


type Card = {
  LikeCount:number,
  commentCount:number,
    postId:{
      _id:string,
      createdAt:string,
      mediaUrl?:string,
      textContent?:string,
      userId?:{
        name:string,
        profilePicture:string | null,
        _id:string
      }


    },
  _id:string

};

const worker:Worker  = new Worker(new URL('@/worker/worker.ts', import.meta.url),{
  type:"module"
})


const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'
const HeroCard = ({item,imgUrl,index,activeIndex,setActiveIndex}:{item:Card,imgUrl:string,index:number,activeIndex:number,setActiveIndex: React.Dispatch<React.SetStateAction<number>>}) => {
  const {userInfo} = useContext(CardContext)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Menu,setMenu] = useState<React.ComponentType<any> | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [Share,setShare] = useState<React.ComponentType<any> | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [CommnetList,setCommnetList] = useState<React.ComponentType<any> | null>(null)
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isShareVisible, setShareVisible] = useState(false);
  const [isCommnetListVisiable, setCommnetListVisiable] = useState(false);
  const [isClickedLIke,setIsClickedLike] = useState(false)

 
 
 
  const [useInRef2, inView2] = useInView({
    threshold:0.1,
    triggerOnce:true,
    

  });
 
  
  const {toast} = useToast()

  const commentRef = useRef<HTMLInputElement | null>(null)
    const ref = useRef<HTMLDivElement | null>(null)
   
 const handelComment = async (id:string,posterId:string |  undefined)=>{
   try{

    if(!commentRef.current) return

    const comment = commentRef.current.value
    const response = await axios.post(`${partialUrl}/user_comment/create_comment?posterId=${posterId}`, {comment,postId:id}, {
      withCredentials: true,
    });
    if(response.status === 200){
      toast({
        title:"comment added"
      })
      commentRef.current.value = ''
    }

   }catch(error){
    console.log(error)
   }
 }
 function formatNumber(num:number) {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';  // Convert to millions
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';  // Convert to thousands
  } else {
    return num;  // Return the number as is if less than 1000
  }
}

const likeCounts =  formatNumber(item?.LikeCount)
const commentCount =  formatNumber(item?.commentCount)




useEffect(()=>{
  const getData = async ()=>{
    if(!inView2) return
    try{
      const response =  await  axios.get(`${partialUrl}/user_like/is_liked?postId=${item.postId._id}`,  {
        withCredentials: true,
      });
     
     if(response.status ===200){
      setIsClickedLike(true)
     }
   
    }catch(error){
      console.log(error)
    }
  }
  getData()
// eslint-disable-next-line react-hooks/exhaustive-deps
},[inView2, item._id])


    const [x,setX] = useState(0)
    const [Y,setY] = useState(0)
    useEffect(()=>{
        if(!ref.current) return
        const element = ref.current;
     
        const handelMouseMove =throttle( 150,(e:MouseEvent)=>{
            if (ref.current) {
                const rect = element.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const mouseX = e.clientX;
                const mouseY = e.clientY;
            
              
                
                const rotateX =( (mouseY - centerY) / rect.height * 0.1); 
                const rotateY = ((mouseX - centerX) / rect.width * 0.1);
                
                setX(rotateX)
                setY(rotateY)
              }
           
        })
       
       
         const handelMouseLeve = ()=>{
            setX(0)
            setY(0)
         }

        element.addEventListener("mousemove",handelMouseMove)
        element.addEventListener("mouseleave",handelMouseLeve)
        return () => {
           
                element.removeEventListener('mousemove', handelMouseMove);
                element.removeEventListener('mouseleave', handelMouseLeve);
            
          };

    },[])
  
    const handelMenuClick = async ()=>{
      if (!Menu) {
        
        const { default: CardMenu } = await import('@/components/common/CardChunks/CardMenu');
        setMenu(() => CardMenu);
      }
      setIsMenuVisible((prev) => {
        const nextState = !prev;
        if (!nextState) {
          setMenu(null); 
        }
        return nextState;
      });
    }
    const handelImportShare = async ()=>{
      
       if(!Share){

         
         const {default:ShareCard} = await import("@/components/common/CardChunks/Share")
         
         
         setShare(() => ShareCard)
        }
      
      setShareVisible((prev)=>{
        const nextState = !prev
        if(!nextState){
          setShare(null)
        }
        return nextState
      })
    }
    const HandelImportCommentList = async ()=>{
      
       if(!CommnetList){

         
        const LazyComments = lazy(() => import('@/components/common/CardChunks/CommentWrapper'));
         
         
         setCommnetList(() => LazyComments)
        }
      
        setCommnetListVisiable((prev)=>{
        const nextState = !prev
        if(!nextState){
          setCommnetList(null)
        }
        return nextState
      })
    }

    const handelLikePosts = async(id:string,posterId:string | undefined)=>{
      setIsClickedLike((prev)=>!prev) 

      worker.onmessage = (event)=>{
        const data = event.data
        console.log(data)
      }
      worker.postMessage({
        posterId,
        id
      })
     return ()=>{
      worker.terminate()
     }
  
    }
  

    

    useEffect(()=>{
      const getLikeCommnetTotoal = async ()=>{


      }
      getLikeCommnetTotoal()
    },[])
    const shouldRender = Math.abs(index - activeIndex) <= 5;

  return (
    <InView as='div' onChange={(inView)=>{
      if(inView){
        setActiveIndex(index)
      }
    }}  style={{  willChange:"transform" ,transition:"all 200ms ease-in",  transform: ` rotateX(${x}deg) rotateY(${Y}deg) translateZ(0px) ` }} className={cn('  overflow-hidden z-10 relative transition-all  w-full sm:w-[590px] md:w-[550px] flex flex-col border rounded-md h-fit shadow-sm ',{
      "md:w-[548px]":!shouldRender ,
      "md:h-[557px]":!shouldRender,
      "sm:w-[590px]":!shouldRender,
      "sm:h-[510px]":!shouldRender,
      "w-full":!shouldRender,
      "h-[580px]":!shouldRender
    })}>
       <div ref={useInRef2}  className={cn(' w-full h-fit',{
        "w-full":!shouldRender,
        "h-full":!shouldRender
       })}>

      
        <div  className={cn(' border-b w-full h-fit py-3 px-1 flex  items-center justify-between',{
            'hidden':!shouldRender
        })}>
            {/* first one for left side */}
            <div className={cn(' w-fit flex justify-center items-center gap-2',{
              'hidden':!shouldRender
            })}>
            <Avatar   >
                <AvatarImage  src={item?.postId?.userId?.profilePicture as string || "https://placehold.co/50x50" } />
                <AvatarFallback>{item?.postId?.userId?.name as string}</AvatarFallback>
                
              </Avatar>
              <div className=' flex flex-col justify-center items-start '>
                <p className=' font-semibold text-base'>{item?.postId?.userId?.name as string}</p>
                <p className=' font-normal text-sm'> {item?.postId?.createdAt ? 
          format(new Date(item?.postId?.createdAt), 'dd/MM/yyyy hh:mm a') 
          : 'Date not available'}</p>

              </div>
            </div>
           {/* this is for right side add more setting later */}
           <div onClick={handelMenuClick} className={cn(' relative',{
             'hidden':!shouldRender
           })}>
            <EllipsisVertical className=' cursor-pointer'/>
            { isMenuVisible && Menu && (
        <Suspense fallback={<div>Loading...</div>}>
          <Menu  id={item._id} poserId={item?.postId?.userId?._id} postId={item?.postId?._id}/> {/* Use Menu only when it's not null */}
        </Suspense>
      )}
           </div>
        </div>

        {/* second one for image and user text */}
        <div className={cn(' px-2 w-full py-2  h-fit flex flex-col justify-center items-center',{
          'hidden':!shouldRender
        })}>
            <p className=' text-left w-full  select-none font-base text-sm text-zinc-950'>{item?.postId?.textContent as string}</p>
        <Imgix src={imgUrl}
       imgixParams={{ ar: "16:9" }}
       className=' select-none w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-md mt-2'
       sizes='100'
       />
       <div className=' select-none pt-2 mt-2 w-full justify-between items-center flex pb-3 border-b'>
        <p onClick={()=>handelLikePosts(item.postId?._id,item.postId?.userId?._id)} className=' cursor-pointer flex justify-center items-center gap-1 font-semibold text-base'><ThumbsUp
        
       className={cn("cursor-pointer ",{
          "stroke-[0]":isClickedLIke,
          "fill-blue-500":isClickedLIke,
          "size-6":isClickedLIke

       })} />{likeCounts}</p>
        <div onClick={HandelImportCommentList} className=' relative cursor-pointer flex justify-center items-center gap-1 font-semibold text-base'><MessageSquareMore
       className={cn("cursor-pointer")} />
       {commentCount}
       {
        isCommnetListVisiable && CommnetList &&
        (
          <Suspense fallback={<div >loading...</div>}>
            <CommnetList id={item?.postId?._id}/>
            </Suspense>

        )
       }
       
       </div>
        <div onClick={handelImportShare} className=' relative cursor-pointer flex justify-center items-center gap-1 font-semibold text-base'><Forward
       className={cn("cursor-pointer")} />
       Shares
       {
                isShareVisible && Share &&(
                <Suspense fallback='loading..'>
                  <Share/>
                </Suspense>
              )
             }
       </div>

       </div>

        </div>
        <div className={cn(' w-full flex flex-col max-h-64 overflow-y-auto py-4',{
           'hidden':!shouldRender
        })}>
          <div className=' px-1 w-full flex justify-between items-center'>
            <div className=' w-[90%] flex justify-center gap-2 items-center'>
            <Avatar  className=' w-7 h-7'  >
                <AvatarImage   src={userInfo.img  || "https://placehold.co/50x50"} />
                <AvatarFallback>{userInfo.name}</AvatarFallback>
                
              </Avatar>
              <input type="text" ref={commentRef} className=' flex-1 border outline-none text-sm px-2 py-2 rounded-md '  placeholder='Add a comment...'/>

            </div>
            <div  onClick={()=>handelComment(item?.postId?._id,item?.postId?.userId?._id)}>
             <SendHorizontal  className=' stroke-blue-500 cursor-pointer'/>
            
            </div>

          </div>

        </div>
        </div>
    </InView>
  )
}

export default memo(HeroCard)