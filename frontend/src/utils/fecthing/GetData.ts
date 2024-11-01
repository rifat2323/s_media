import axios  from "axios";




const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'

const fetch_get_data = async (url:string)=>{
   

try{
   const response = await axios.get(`${partialUrl}/${url}`,{
       withCredentials:true,
       
   })
   return {response:response, error:null}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
}catch(error:any){
   console.log(error)
   return {response:null, error:error}
}



}
export default fetch_get_data

