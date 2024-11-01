import axios from "axios";


const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'
export interface WorkerData {
    posterId: string | undefined;
    id: string;
  }
  
 
  self.onmessage = async (event) => {
    const { posterId, id } = event.data as WorkerData;
  
     console.log("doing somthing")
    try {
        
            const response =  await  axios.get(`${partialUrl}/user_like/create?posterId=${posterId}&postId=${id}`,  {
               withCredentials: true,
             });
           
          
  
    
      self.postMessage(response.status === 200 ? "success" : "error");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Handle errors appropriately
      self.postMessage({ error: "error" });
      console.log(error);
    }
  };
  
  // To keep TypeScript happy
  export default null;
  
