import { cn } from "@/lib/utils";
import { useEffect, useRef,useState } from "react"
import axios  from "axios";
import { useToast } from "@/hooks/use-toast"



const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'
const Login = ({setPathname}:{setPathname: React.Dispatch<React.SetStateAction<string>>}) => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const {toast} = useToast()
 const [isLoading,setIsloading] = useState(false)
 useEffect(()=>{
  setPathname('/login')

 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[])
const handelSubmit =  async(e:React.FormEvent<HTMLFormElement>)=>{
  e.preventDefault();
  if(isLoading) return
  setIsloading(true)
  if(emailRef.current && passwordRef.current){
    
      const email = emailRef.current.value
     const  password =passwordRef.current.value
     try{
      const {data} = await axios.get(`${partialUrl}/user/login?email=${email}&password=${password}`,{
        withCredentials:true
      })
   
      localStorage.setItem("user_info",JSON.stringify(data.user))
      console.log(data.user)
      window.location.href = '/'
      setIsloading(false)

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     }catch(error:any){
      toast({
        title: error.response.data,
        duration:1000
    
      })
      setIsloading(false)

      console.log(error)
     }
 
    
  }
}


  return (
    <div className="flex w-full min-h-full flex-col justify-center px-6 py-12 lg:px-8">
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img className="mx-auto h-10 w-auto" src="https://robohash.org/rifat" alt="Your Company"/>
      <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
    </div>
  
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handelSubmit} className="space-y-6" action="#" method="POST">
        <div>
          <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
          <div className="mt-2">
            <input ref={emailRef} id="email" name="email" type="email"  required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
          </div>
        </div>
  
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
            <div className="text-sm">
              <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
            </div>
          </div>
          <div className="mt-2">
            <input ref={passwordRef} id="password" name="password" type="password"  required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"/>
          </div>
        </div>
  
        <div>
          <button type="submit" className={cn("flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",{
            "cursor-not-allowed opacity-50": isLoading
          })}>Sign in</button>
        </div>
      </form>
  
      <p className="mt-10 text-center text-sm text-gray-500">
        Not a member?
        <a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Start a 14 day free trial</a>
      </p>
    </div>
  </div>
  )
}

export default Login