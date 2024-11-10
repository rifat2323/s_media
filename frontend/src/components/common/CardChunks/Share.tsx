

import React, { useState,useRef } from "react";
import { Copy } from 'lucide-react';
import { Check } from 'lucide-react';

const Share = ({id}:{id:string}) => {
  const [isCopied, setIsCopied] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null)

  const handleCopy = () => {
    if(isCopied) return
    if (ref.current) {
      navigator.clipboard.writeText(ref.current.value);
      setIsCopied(true);
    } else {
      alert("Nothing to copy!");
      setIsCopied(false)
    }
  };
  const handelClick = ( e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
    e.stopPropagation()

  }

  return (
    <div onClick={handelClick} className=" flex justify-center items-center absolute top-0  -right-1 z-10 w-[250px] sm:w-[300px] md:w-[400px] mt-10 bg-white shadow-lg rounded-lg p-1">
      
      
        <input
           ref={ref}
          type="text"
          
           defaultValue={`${window.location.href}singlePost/${id}`}
          placeholder="Enter text to copy"
          className=" flex-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
 
      <button
        onClick={handleCopy}
        className="w-fit p-2"
      >
        {
            isCopied ? <Check className=" stroke-green-500"/>:  <Copy/>
        }
     
      </button>
    </div>
  );
};

export default Share;
