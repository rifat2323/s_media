
import fetch_get_data from '@/utils/fecthing/GetData'
import { useEffect, useState } from 'react'
import HeroCard from '../common/HeroCard'
import { useInView } from "react-intersection-observer";
import { useProfilePost } from '@/zustan/userProfilePost';
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
  
  }[];
const Post = ({shouldFetch}:{shouldFetch:boolean}) => {
/*     const [data,setData] = useState<Card | []>([])
    const [cursor,setCursor] = useState('')
    const[loading,setLoading] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0);
    const [useInRef, inView] = useInView({
        threshold:0,
        
    
      });
    useEffect(()=>{
     const getData = async ()=>{
        if (loading || !inView || !shouldFetch) return;
       

       setLoading(true)

        const {response,error} = await fetch_get_data(`user_profile/user_post/get_user_post?cursor=${cursor}`)
       
        if(error || !response){
            setLoading(false)
            return

        }
        setData((prev)=>[...prev,...response.data.post])
        setCursor(response.data.sendCursor)
        setLoading(false)
     }
     getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[inView,shouldFetch]) */


    const [activeIndex, setActiveIndex] = useState(0);
    const {Refresh,cursor,getProfilePost,loading,noMorePost,post} = useProfilePost((state)=>state)

    useEffect(()=>{
      if(!shouldFetch || noMorePost || loading) return

      getProfilePost(cursor)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[noMorePost,loading,shouldFetch])
  return (
    <div  className=' w-full h-auto flex justify-center items-center flex-col gap-1'>
        
       {
         post && post.map((item,index)=>(<HeroCard key={index} index={index} setActiveIndex={setActiveIndex} activeIndex={activeIndex} item={item} imgUrl={item.postId.mediaUrl as string || "https://picsum.photos/800/800"}/>))
       }
       {
        loading && (
            <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'></div>

        )
       }
       {
        noMorePost && (
            <div className=' text-lg text-gray-950'>No Post create some new Post</div>
        )
       }
      
</div>
  )
}

export default Post