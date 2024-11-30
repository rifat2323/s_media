 import { lazy,Suspense,useContext, useState } from "react"

import { CardContext } from "@/context/CardCOntext"
import { Button } from "../ui/button";


 const HeroCard = lazy(()=>import("@/components/common/HeroCard"))
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
const CardsComponent = () => {
  const {cards,LoadMoreData,noMoreCard} = useContext(CardContext)
 /*  console.log(cards) */
 const [activeIndex, setActiveIndex] = useState(0);

  
 
  return (
    <div  className='   w-full py-3 px-2 flex justify-center gap-3 md:gap-2 items-center flex-col'>
     
 
   {
    cards?.map((item:Card,index)=>(
      
      <Suspense key={item._id+Math.random()} fallback={<div>Loading...</div>}>

   <HeroCard index={index} setActiveIndex={setActiveIndex} activeIndex={activeIndex}  imgUrl={item?.postId.mediaUrl as string ||"https://picsum.photos/800/800"} item={item} />
      </Suspense>
  
    ))
   }
   {
    !noMoreCard ?(
      <Button onClick={()=>LoadMoreData()} className=" bg-blue-500 hover:bg-blue-600 ">Load More</Button>

    ):(
      <p className=" text-gray-500">look like you seen everything</p>
    )
   }
   

    </div>
  )
}

export default CardsComponent