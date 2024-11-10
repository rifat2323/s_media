import { ArrowLeftFromLine, Home } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import fetch_get_data from '@/utils/fecthing/GetData'
import HeroCard from '@/components/common/HeroCard'

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
const SingalePost = () => {
    const navigate = useNavigate()
    const {postId} = useParams()
    const [data,setData] = useState<Card | null>(null)
    const [loading,setLoading] = useState(false)
  
 
    useEffect(()=>{
        const getData = async ()=>{
            if(loading ) return
            setLoading(true)
            const {error,response} = await fetch_get_data(`public/post/${postId}`)
            if(error || !response){
                console.log(error)
                setLoading(false)
                return
            }
            setData(response.data)
            setLoading(false)
        }
        getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
   
  return (
    <div  className="min-h-screen  flex flex-col">
      {/* Navbar */}
      <nav  className="bg-white ">
        <div  className="max-w-7xl mx-auto px-4 py-4 flex items-center cursor-pointer">
          <ArrowLeftFromLine  className="h-6 w-6 text-gray-700 stroke-blue-500  mr-5 " onClick={()=>{
          window.history.go(-1)
        }} />
          <Home className="h-6 w-6 text-gray-700 stroke-blue-500  " onClick={()=>window.location.href = "/"}  />
        
        </div>
      </nav>
      
      {/* Body Section */}
      <div className="flex-grow flex items-center justify-center">
        <div className="p-4">
         {
          !loading &&  data !== null &&(
                <HeroCard imgUrl={data.postId.mediaUrl || "https://picsum.photos/800/800"} item={data}  activeIndex={0} index={0} setActiveIndex={()=>{}} />
            )
         }
          {
        loading && (
            <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'></div>

        )
       }
       {
         !loading && data === null &&(
            <div className='text-center text-2xl'>Not found</div>
        )
       }
        </div>
      </div>
    </div>
  )
}

export default SingalePost