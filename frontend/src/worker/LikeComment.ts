import axios from "axios";


const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'
export interface WorkerData {
    
    url: string;
  }
  
 
  self.onmessage = async (event) => {
    const {  url } = event.data as WorkerData;
  
     console.log("doing getiing like Comment")
    try {
        
            const {data} =  await  axios.get(`${partialUrl}/${url}`,  {
               withCredentials: true,
             });
           
          
  
    
      self.postMessage(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Handle errors appropriately
      self.postMessage({ data:null });
      console.log(error);
    }
  };
  
  // To keep TypeScript happy
  export default null;
  
