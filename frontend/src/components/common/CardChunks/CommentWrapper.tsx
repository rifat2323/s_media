
import { useState,useEffect } from 'react';
import Comment from './Comment';

import { useContext } from 'react';
import { CardContext } from '@/context/CardCOntext';
type Props = {

  _id:string,
  userId:{
    name:string,
    profilePicture:string
    _id:string
  },
  content:string,
  postId:string
}
const CommentList = ({id}:{id:string}) => {
  const {getComment} = useContext(CardContext)
  const [sendCursor,setSendCursor] = useState<string | null>(null)
  const [comment,setComment] = useState<Props[]>([])
  const [loading,setLoading] = useState(false)
 

 useEffect(()=>{
   const url = sendCursor ? `user_comment/get_comment?postId=${id}&cursor=${sendCursor}` : `user_comment/get_comment?postId=${id}`
  const fetchData =  async ()=>{
    setLoading(true)
    const data = await getComment(url)
    
    setLoading(false)
    setComment(data?.post)
    if(data){
      setSendCursor(data.sendCursor)
    }
  }

  fetchData()

 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[])
     


 

  return (
    <div className=" absolute  min-w-[300px] -top-[300px] rounded h-[300px]  items-center overflow-y-auto bg-white flex flex-col justify-start gap-4 border   mt-1shadow-md z-10">
      {loading && (
        <div className=' w-12 h-12 animate-spin border-t-2 border-b-2 rounded-full border-black'>

        </div>
      )}
      {
        comment.length ===0 && !loading ?(
          <div>No comment</div>
        ):(
          comment?.map((item:Props) => (
            <Comment
              key={item._id}
              image={item.userId.profilePicture}
              name={item.userId.name}
              comment={item.content}
              postId={item.postId}
              commentId={item._id}
              userId={item.userId._id}
              
              />
          ))
        )
      }
    
    </div>
  );
};

export default CommentList;
