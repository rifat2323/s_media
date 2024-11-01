import React, { useRef, useState,forwardRef } from 'react';
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-green-500">
      <form 
        className="bg-white p-8 rounded-lg shadow-md max-w-md w-full space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">Create an Account</h2>

        <InputField
          label="Full Name"
          type="text"
          name="fullName"
           ref={fullNameRef}
          maxLength={35}
          minLength={4}
          
          required
        />

        <InputField
          label="Email"
          type="email"
          name="email"
         ref={emailRef}
          required
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          ref={passwordRef}
          minLength={8}
          maxLength={45}
          required
        />

        <InputField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          ref={confirmPasswordRef}
          minLength={8}
          maxLength={45}
          required
        />

     

        <button 
          type="submit" 
          className={`w-full py-3 text-white font-bold rounded-md transition-all ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
              <span>Registering...</span>
            </div>
          ) : (
            'Register'
          )}
        </button>
      </form>
    </div>
  );
};

const InputField = forwardRef<HTMLInputElement, Field>(({ label, type, name, onChange, required, placeholder, minLength, pattern, maxLength }, ref) => (
    <div className="flex flex-col">
      <label className="mb-2 text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        minLength={minLength}
        ref={ref}
        maxLength={maxLength}
        pattern={pattern}
        className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 invalid:border-red-300 valid:border-green-300"
      />
    </div>
  ));

export default RegistrationForm;
