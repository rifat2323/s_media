
import  { useState,useRef } from 'react';
import { Image, Video, MessageSquareShare  } from 'lucide-react';
import Post_Datas from '@/utils/fecthing/postDatas';
import { useToast } from '@/hooks/use-toast';


const StoryAdder = () => {
  const [loading, setLoading] = useState(false);
  const picture_ref = useRef<HTMLInputElement | null>(null)
  const text_ref = useRef<HTMLTextAreaElement | null>(null)
  const [img,setImg] = useState<string | null>(null)
 const {toast} = useToast()
  const handleShare =  async () => {
    if (!picture_ref.current && !text_ref.current) return;

    if(loading) return;
    const fromData = new FormData()

 if(picture_ref.current?.files?.[0]){
  fromData.append("image",picture_ref.current?.files?.[0])
  
 }
 if(text_ref.current?.value){

   fromData.append("textContent",text_ref.current?.value)
 }
 setLoading(true)

 const {error,response} = await Post_Datas(`user_stroies/create_story`,fromData)
 if(error){
  toast({
    title:error?.response?.data
  })
  setLoading(false)
 }
 if(response?.status === 201){
  toast({
    title:"Story created successfully"
  })
 }
 setLoading(false)
};

  return (
    <div onClick={(e)=>e.stopPropagation()} className="  relative w-[250px] sm:w-[500px] mx-auto mt-8 p-4 bg-white shadow-md rounded-lg">
        <div className="  absolute -top-[19px] right-2 rotate-[270deg] w-0 h-0 
  border-t-[10px] border-t-transparent
  border-l-[15px] border-l-gray-400
  border-b-[10px] border-b-transparent">
</div>
      <textarea
        ref={text_ref}
        placeholder="What's on your mind?"
        className="w-full h-32 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      {/* Icons */}
      <div className="flex w-full justify-between items-center mt-4">
        <div className="flex space-x-4">
        <label htmlFor="file">
          <input onChange={(e)=>setImg(URL.createObjectURL( e.target?.files?.[0] as Blob))} id="file" type="file" accept="image/*"  className="hidden" ref={picture_ref}/>
          <Image className="text-gray-500 hover:text-blue-500 cursor-pointer" size={24} />
          </label>
          <button className="text-gray-500 hover:text-blue-500">
            <Video className="w-6 h-6" />
          </button>
        </div>
        {
          img &&(
            <img src={img} width={40} height={30} alt="story image"/>

          )
        }
        

        {/* Share button */}
        <button
          onClick={handleShare}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          <MessageSquareShare className="w-5 h-5 mr-2" />
          Share
        </button>
      </div>
    </div>
  );
};

export default StoryAdder;
