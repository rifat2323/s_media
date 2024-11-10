import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import fetch_get_data from "@/utils/fecthing/GetData"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useInView } from "react-intersection-observer"
import {format } from 'date-fns'
import {useNavigate} from 'react-router-dom'

type data = {
    createdAt:Date,
    name:string,
    profilePicture:string,
    _id:string
  }
  // i should fix this fetch data from main page and pass as prop
const People = ({shouldLoadMore,setShouldLoadMore}:{shouldLoadMore:boolean,setShouldLoadMore: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const [data,setData] = useState<data[] | []>([])
    const [cursor,setCursor] = useState('')
    const [loading,setLoading] = useState(false)
  
    const {text} = useParams()
    const [useInRef, inView] = useInView({
        threshold:0,
    })
  
     const navigate = useNavigate()
    useEffect(() => {
     
        const getData =  async ()=>{
            if(!shouldLoadMore || !inView || loading ) return
           
            setLoading(true)
            setShouldLoadMore(false)
           
         const {error,response} = await fetch_get_data(`user_search/search_user?keyword=${text}&cursor=${cursor}`)
         if(error || !response){
             console.log(error)
             setLoading(false)
             return
         }
         console.log(response.data.user)
         setData((prev)=>[...prev,...response.data.user])
         setCursor(response.data.sendCursor)
         setLoading(false)
        }
        getData()
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[ inView, loading, shouldLoadMore])
  return (
    
    <div ref={useInRef} className=" w-full flex flex-col gap-1 items-center justify-center">

    {
        loading && (
            <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'></div>
        )
    }
    

    {
        !loading && data.length === 0 && (
            <div className=" text-2xl font-semibold text-gray-900">No Result found</div>
        )
    }
     {
        !loading && data.map(item=>(
            <Card key={item._id}   className="overflow-hidden w-full max-w-2xl">
            <CardContent className="p-0 ">
              <div className="flex   items-center ">
                <Avatar className="h-full w-24 sm:h-full  ">
                  <AvatarImage src={ item.profilePicture||"https://placehold.co/600x400"}  className=" object-center" />
                  <AvatarFallback className="rounded-none">
                    <User className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col w-full p-4 space-y-2">
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <div className="text-sm text-gray-500 mt-1">
                      Since {format(item.createdAt, "MM/yyyy")}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full sm:w-auto"
                    onClick={() => {
                      navigate(`/visit_profile/${item._id}`)
                    }}
                  >
                    <span className="sm:hidden">Profile</span>
                    <span className="hidden sm:inline">Visit Profile</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        ))
     }
  









      </div>
   
  )
}

export default People