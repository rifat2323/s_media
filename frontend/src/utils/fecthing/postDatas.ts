import axios  from "axios";




const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'

const Post_Datas = async <T,>(url:string,postData?:T | undefined)=>{
   

try{
   const response = await axios.post(`${partialUrl}/${url}`,postData,{
       withCredentials:true,
       
   })
   return {response:response, error:null}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
}catch(error:any){
   console.log(error)
   return {response:null, error:error}
}



}
export default Post_Datas

