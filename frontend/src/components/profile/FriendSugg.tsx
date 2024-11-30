



import FriedSuggAv from '../UserRecommend/FriedSuggAv'
import { Button } from '../ui/button'
import { useProfileSuggation } from '@/zustan/profile_Suggation'

const FriendSugg = () => {
 
  /*   const [loading,setLoading] = useState(false)
    const [data,setData] = useState<people | []>([])
    const [page,setPage] = useState(0)
    const [shouldHiddenButton,setShouldHiddenButton] = useState(false)

  useEffect(()=>{
    const user_friend_data = localStorage.getItem("user_friend")
    const user_friend = JSON.parse(user_friend_data || "[]")
    const getData = async ()=>{
      setLoading(true)
       const {error,response} = await Post_Datas(`user_friend/get_friend_suggestion?page=${page}`,{user_friend})
       if(error || !response){
        toast({
            title:error?.response?.data
        })
        if(error.status === 404){
          setShouldHiddenButton(true)
        }
        
        setLoading(false)
        return
       }
       console.log(response.data)
       setData((prev)=>[...prev,...response.data])
       setLoading(false)
    }
    getData()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[page])
 
  console.log(data)
  const handleLoadMore = ()=>{
    setPage((prev)=>prev+1)
  } */
 

  const {data} = useProfileSuggation((state)=>state)
  const suggationSet = useProfileSuggation((state)=>state.getMoreSuggestion)
  const {incasePage} = useProfileSuggation((state)=>state)
  const {loading} = useProfileSuggation((state)=>state)
  const {noMoreSuggestion} = useProfileSuggation((state)=>state)
  const {page} = useProfileSuggation((state)=>state)
  
  return (
    <div className=' w-full h-auto  flex flex-col justify-center items-center py-2'>
        {
        loading && <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'>
          
          </div>
      }
      {
         data?.map(item=>(
          <FriedSuggAv person={item} key={item._id}/>

        ))
      }
     {
      !noMoreSuggestion &&(
        <Button onClick={()=>{
          incasePage()
          suggationSet(page+1)

        }} className=' bg-blue-500 text-white hover:bg-blue-600'>Load More</Button>
      )
     }
     {
      noMoreSuggestion && (
        <div className=' text-lg text-gray-950'>No More Suggestion</div>
      )
     }
  
    </div>
  )
}

export default FriendSugg