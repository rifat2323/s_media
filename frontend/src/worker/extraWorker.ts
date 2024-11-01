import axios from "axios";


const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'
export interface WorkerData {
    url:string
  }
  
 
  self.onmessage = async (event) => {
    const {url } = event.data as WorkerData;
  
     console.log("doing somthing")
    try {
        
            const {data} =  await  axios.get(`${partialUrl}/${url}`,  {
               withCredentials: true,
             });
           
          
  
    
      self.postMessage({data:data, error: null });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Handle errors appropriately
      self.postMessage({data:null, error: "error" });
      console.log(error);
    }
  };
  
  // To keep TypeScript happy
  export default null;
  
