 import { lazy,Suspense,useContext, useState } from "react"

import { CardContext } from "@/context/CardCOntext"


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
  const {cards} = useContext(CardContext)
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

    </div>
  )
}

export default CardsComponent