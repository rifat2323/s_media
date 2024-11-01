import  { useEffect, useState } from 'react'
import HeroCard from '@/components/common/HeroCard'
import fetch_get_data from '@/utils/fecthing/GetData';
import { useToast } from '@/hooks/use-toast';
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
const PopularPost = () => {
    const [selectedTab, setSelectedTab] = useState('likes');
    const [CardData,setCardData] = useState<Card[]>([])
   const [coursor,setCoursor] = useState<string | null>(null)
   const [activeIndex, setActiveIndex] = useState(0);
   const [loading,setLoading] = useState(false)
   const [url,setUrl] = useState<string >(`user_like/get_popular_like_post?`)
  const {toast} = useToast()
    
 const handelClick = (tab:string)=>{
    setSelectedTab(tab)
   
    if(tab === "likes"){
        setUrl(`user_like/get_popular_like_post?`)
    }else{
        setUrl(`user_comment/get_popular_comment_post?}`)
    }
     
 }
 useEffect(()=>{
    setCoursor(null)
    setCardData([])
 },[selectedTab])

   useEffect(()=>{
    const getData = async ()=>{
       setLoading(true)
       const {response,error} = await fetch_get_data(`${url}cursor=${coursor}`)
       console.log(response)
       if(response){
        setCardData((prevCardData) => [...prevCardData, ...response.data.post]);
   /*      setCoursor(response.data.sendCursor) */
       }
       console.log(error) 
       if(error?.status === 401){
        toast({
            title: 'Unauthorized',
            description: 'Please login to continue',
           
          })
          setTimeout(() => {
            window.location.href = '/login'
          }, 2000);
       }
       setLoading(false)
    }
    getData()

   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[url])


    return (
      <div className="h-screen overflow-y-auto scrollbar-hide bg-gray-100 flex flex-col items-center ">
        <div className="w-full max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 ">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => handelClick('likes')}
              className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                selectedTab === 'likes'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Most Liked
            </button>
            <button
              onClick={() => handelClick('comments')}
              className={`py-2 px-4 rounded-lg font-semibold transition-all ${
                selectedTab === 'comments'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Most Commented
            </button>
          </div>
          {
            loading && (
                <div className=' w-full justify-center items-center flex'>
                 <div className=' w-10 h-10 animate-spin rounded-full border-t-4 border-b-2  border-blue-500 '>

              </div> 
                </div>
               
            )
          }
  
          <div className="space-y-4">
            {
                !loading && CardData.map((card,index)=>(
                    <HeroCard index={index} setActiveIndex={setActiveIndex} activeIndex={activeIndex} item={card} imgUrl={card.postId.mediaUrl as string} key={card._id}/>
                ))
            }
           
          </div>
        </div>
      </div>
    )
}


export default PopularPost