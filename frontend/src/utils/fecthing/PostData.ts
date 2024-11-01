import axios, { AxiosResponse } from "axios";
import { useState,useEffect } from "react";
const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'
const PostData = <T,D>(url:string, postData?: D | undefined)=>{
 const [data,setData] = useState<AxiosResponse | null>(null)
 const [error,setError] = useState<unknown | null>(null)
 const [loading,setLoading] = useState(false)
 useEffect(()=>{
    const fetchData = async ()=>{
        setLoading(true)
    
     try{
        const response = await axios.post<T>(`${partialUrl}/${url}`,postData,{
            withCredentials:true,
            
        })
        setData(response)
        setLoading(false)
    
     }catch(error){
        console.log(error)
        setError(error)
        setLoading(false)
     }finally{
        setLoading(false)
     }
    
    
    
    }
    fetchData()

 },[postData, url])


return {data,error,loading}
}

export default PostData


