import React, { useRef, useState,forwardRef } from 'react';
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

type Field = { 
    label:string
    ,
     type:string
    , name:string,
     onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void,
      required?:boolean,
       placeholder? :string,
       minLength?:number,
       pattern?:string,
       maxLength?:number,
       ref: React.ForwardedRef<HTMLInputElement>
}

const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'
const RegistrationForm = () => {
    const fullNameRef = useRef<HTMLInputElement | null>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const confirmPasswordRef = useRef<HTMLInputElement | null>(null);

    const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

 const {toast} = useToast()
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation()

    setLoading(true);

   if(fullNameRef.current && emailRef.current &&passwordRef.current &&confirmPasswordRef.current ){
     if(passwordRef.current.value !== confirmPasswordRef.current.value){
        return alert('Passwords do not match!');
     }
    const formData = {
        name: fullNameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
      
        
      };

      try{
        const response = await axios.post(`${partialUrl}/user/register`, formData);
        console.log(response);
        navigate('/login');
        setLoading(false);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }catch(error:any){
        toast({
          title: error.message,
          
      
        })
        console.log(error)
        setLoading(false);
      }
      
       
        
     
   }
    

   
 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
    <Card className="w-full max-w-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Register</CardTitle>
        <CardDescription className="text-center">Create your account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input ref={fullNameRef} min={4} max={20} id="fullName" placeholder="John Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input ref={emailRef} id="email" type="email" placeholder="john@example.com" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                min={8}
                ref={passwordRef}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                ref={confirmPasswordRef}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-sm text-gray-600">
        Already have an account? <a href="#" className="text-blue-600 hover:underline">{loading ? "loading...":"Log in"}</a>
      </CardFooter>
    </Card>
  </div>
  );
};



export default RegistrationForm;
