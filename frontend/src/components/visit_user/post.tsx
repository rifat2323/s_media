
import fetch_get_data from '@/utils/fecthing/GetData'
import { useEffect, useState,useContext } from 'react'
import HeroCard from '../common/HeroCard'
import { useInView } from "react-intersection-observer";
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { CardContext } from '@/context/CardCOntext';
import { useVisitProfile } from '@/zustan/visit_profile';
import RefreshButton from '../common/RefreshButton';
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
const Post = ({id}:{id:string}) => {
   /*  const [data,setData] = useState<Card | []>([])
    const [cursor,setCursor] = useState('')
    const[loading,setLoading] = useState(false) */
    const [activeIndex, setActiveIndex] = useState(0);


    const {card,getRefreshData,cursor,getData,loading,noMoreCard} = useVisitProfile((sate)=>sate)
  return (
    <div className=' w-full h-auto flex justify-center items-center flex-col gap-1'>
      {
        card.length === 0 && !noMoreCard&&(
          <div className=' w-full flex justify-end mb-3'>
  
          <RefreshButton onClick={()=>{ getRefreshData(id)}} isLoading={loading} />
          </div>

        )
      }
     
        
       {
        card.map((item,index)=>(<HeroCard key={index} index={index} setActiveIndex={setActiveIndex} activeIndex={activeIndex} item={item} imgUrl={item.postId.mediaUrl as string || "https://picsum.photos/800/800"}/>))
       }
       {
        loading && (
            <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'></div>

        )
       }
       {
        card.length ===0 && (
            <div className=' text-lg text-gray-950'>No Post create some new Post</div>
        )
       }
       {
         !noMoreCard && card.length >=10 && !loading && (
            <Button onClick={()=>{
              getData(id,cursor)
            }} className=' bg-blue-500 text-white hover:bg-blue-600'>Load more</Button>
        )
       }
      
</div>
  )
}

export default Post