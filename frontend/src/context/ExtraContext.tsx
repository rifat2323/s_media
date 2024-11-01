
import React,{createContext,useEffect,useState} from 'react'
import axios from 'axios';
import { throttle } from 'throttle-debounce';
type response = {
    [key:string]:string,

}[]
type suggation = {
    name:string,
    profilePicture:string,
    _id:string
}[]

type context = {
 
 data:response,
 page:number,
 setPage:React.Dispatch<React.SetStateAction<number>>,
 friendSuggation:suggation,
 loading?:boolean

}
const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'

const worker:Worker = new Worker(new URL('@/worker/extraWorker.ts', import.meta.url),{
    type:"module"

})


export const ExtraContext = createContext<context>({
    data:[],
    page:0,
  
    friendSuggation:[],
    setPage:()=>{},
    loading:false
})

const ExtraContextParent = ({children}:{children:React.ReactNode}) => {
    const [data,setData] = useState<response>([])
    const [friendSuggation,setFriendSuggation] = useState<suggation>([])
    const [page,setPage] = useState(0)
    const [loading,setLoading] = useState(false)

   useEffect(()=>{
    const user_friend_data = localStorage.getItem("user_friend")
    const user_friend = JSON.parse(user_friend_data || "[]")
   

    const fetchData =throttle(300, async ()=>{
        if(loading) return
        setLoading(true)
        try{
            const {data} = await axios.post(`${partialUrl}/user_friend/get_friend_suggestion?page=${page}`,{user_friend},{
                withCredentials:true
            })
            setFriendSuggation(data)
           
            setLoading(false)
        }catch(error){
            console.log(error)
            setLoading(false)
        }
    }
)
    setTimeout(()=>{
        fetchData()

    },2000)
    

   // eslint-disable-next-line react-hooks/exhaustive-deps
   },[page])





    useEffect(()=>{
       
        worker.onmessage = (event)=>{
            const data = event.data
          console.log(data)
          if(data.data){
            localStorage.setItem("user_friend",JSON.stringify(data.data))
            worker.terminate()
            
          }
          
        }

        worker.postMessage({
            url:'user_friend/get_friend_list'
        })

      
    },[])
  return (
    <ExtraContext.Provider value={{data,page,setPage,friendSuggation,loading}}>
        {children}
    </ExtraContext.Provider>
  )
}

export default ExtraContextParent