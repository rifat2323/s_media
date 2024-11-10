import  { useState } from 'react'
import HeroCard from '@/components/common/HeroCard'

import { usePopularPost } from '@/zustan/popular_post';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import RefreshButton from '@/components/common/RefreshButton';

const PopularPost = () => {
   
   const [activeIndex, setActiveIndex] = useState(0);
    const [selectedTab,setSelectedTab] = useState('like')

   const {cursor_comment,cursor_like,loading_like,loading_comment,noMorePost_like,noMorePost_comment,getFetchData,getInitialData,post_comment,post_like,unAuthorized} = usePopularPost((state)=>state)
   console.log(noMorePost_like)
    return (
      <div className="h-screen overflow-y-auto scrollbar-hide bg-gray-100 flex flex-col items-center ">
        
        <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 ">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() =>{ 
                setSelectedTab('like')
                setActiveIndex(0)
              }}
              className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                selectedTab === 'like'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Most Liked
            </button>
            <button
            onMouseEnter={()=>{
              if(noMorePost_comment || post_comment && post_comment.length) return
              getInitialData("comment")
            }}
              onClick={() =>{ 
                setSelectedTab('comment')
                setActiveIndex(0)
              

              }}
              className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                selectedTab === 'comment'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Most Commented
            </button>

          </div>
          {
          unAuthorized && (
            <Link to={'/login'}>Login</Link>
          )
        }
        {
          !noMorePost_like && !post_like.length && (
            <RefreshButton onClick={()=>getInitialData("like")}/>
          )
        }


        
  
          <div className="space-y-4">
            {
             selectedTab === 'like' ?  post_like.map((card,index)=>(
              <HeroCard index={index} setActiveIndex={setActiveIndex} activeIndex={activeIndex} item={card} imgUrl={card.postId.mediaUrl as string} key={card._id}/>
                   
                )):
                post_comment.map((card,index)=>(
                  <HeroCard index={index} setActiveIndex={setActiveIndex} activeIndex={activeIndex} item={card} imgUrl={card.postId.mediaUrl as string} key={card._id}/>
                  
                ))
            }
           
          </div>
        <p className=' text-gray-900 text-lg text-center mt-4'>{noMorePost_like && selectedTab === 'like' ? "no more post" : noMorePost_comment && selectedTab === "comment" ? "no more comment":""}</p>
         <div className=' w-full flex justify-center items-center'>
         
         <Button onClick={()=>{
          const cursor = selectedTab === 'like' ? cursor_like : cursor_comment
          const tab = selectedTab === 'like' ? "like" : "comment"
           getFetchData(cursor,tab)


         }}  className={cn(' bg-blue-500 hover:bg-blue-600 mt-4',{
          "hidden": noMorePost_like && selectedTab === 'like' || noMorePost_comment && selectedTab === "comment"
           
         })}>Load more</Button>
         
           {
            loading_like ||loading_comment  && (
                <div className=' w-full justify-center items-center flex'>
                 <div className=' w-10 h-10 animate-spin rounded-full border-t-4 border-b-2  border-blue-500 '>

              </div> 
                </div>
               
            )
          }

         </div>
       
        </div>
      </div>
    )
}


export default PopularPost