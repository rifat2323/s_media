import React, { createContext,  useEffect, useState,useMemo  } from 'react';
import axios from 'axios';
import { io,Socket } from "socket.io-client";
import { useChatList } from '@/zustan/Message';
type Card = {
  LikeCount:number,
  commentCount:number,
    postId:{
      _id:string,
      createdAt:string,
      mediaUrl?:string,
      textContent?:string,
      userId?:{
        name:string,
        profilePicture:string | null,
        _id:string
      }


    },
  _id:string,
  isLiked:boolean

};

type CardContextType = {
  cards: Card[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getComment: (url:string) => Promise<any>;
  
  userInfo:{
    id:string,
    name:string,
    img:string | null,
    coverPhoto:string
  },
  noMoreCard:boolean,
  LoadMoreData:() => Promise<void>;
  Socket:Socket | null

};
type user = {
  id:string,
    name:string,
    img:string | null,
    coverPhoto:string,
  
}
const partialUrl:string =   import.meta.env.VITE_BASE_URL as string ?? 'http://localhost:4000'
export const CardContext = createContext<CardContextType >({
    cards:[],
    getComment: async () => Promise.resolve(),
    userInfo:{
      id:'0',
      name:"placeholder",
      img:"https://placehold.co/50x50",
      coverPhoto:''
    },
    noMoreCard:false,
    LoadMoreData: async () => Promise.resolve(),
    Socket:null
});


export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [userInfo, setUserInfo] = useState<user >({ id:'0',
    name:"placeholder",
    img:"https://placehold.co/50x50",
    coverPhoto:''

  });
   const {updateList} = useChatList((state)=>state)
 
  const [cursor,setCursor] = useState('')
  const [random_cursor,setRandomCursor] = useState('')
  const [noMoreCard,setNoMoreCard] = useState(false)
  const [Socket,setSocket] = useState<Socket  | null>(null)
  const socket = useMemo(() => io(partialUrl,{
    withCredentials:true
  }),[])
  useEffect(()=>{
  
    socket.on('connect',()=>{
      console.log("connect to soket")
      setSocket(socket)
    })
    socket.on("disconnect", (reason) => {
     console.log("reason",reason)
    });
    socket.on("update_friend_list",(data)=>{
      updateList(data)
    })
    const handelDissconnect =()=>{
      socket.disconnect();
      
    }
    window.addEventListener("beforeunload", handelDissconnect);
    return () => {
      setSocket(null); // Clear the state
      if (socket.connected) {
        socket.disconnect(); // Disconnect the socket
      }
      window.removeEventListener("beforeunload", handelDissconnect);
    };
  },[])

 useEffect(() => {
  const user_info = JSON.parse(localStorage.getItem("user_info") as string);
  setUserInfo(user_info ?? {  name:"placeholder",
    img:"https://placehold.co/50x50",
    coverPhoto:''})
  
 // eslint-disable-next-line react-hooks/exhaustive-deps
 },[])
 

  useEffect(() => {
    const fetchCards = async () => {
      const user_friend_data = localStorage.getItem("user_friend")
      const user_friend = JSON.parse(user_friend_data || "[]")
    
      try {
        const { data } = await axios.post(`${partialUrl}/userpost/get_post_body?cursor=${cursor}&random_cursor=${random_cursor}`, {friend:user_friend}, {
          withCredentials: true,
        });
        console.log("loading more context")
        setCards((prev)=>[...data.posts,...prev]); // Assuming data.posts is the array of cards
        setCursor(data.cursor)
        setRandomCursor(data.random_cursor)
       
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error:any) {
        console.error("Error fetching cards:", error);
        //have to fix this so it should only run when in home page and not in other pages
        // it causes an error when you are not logged in
       
        if(error?.status === 401){
          /* navigate('/login') */
          console.log("user not logged in")
       
        }
        
      }
    };
    fetchCards();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

 const getComment = async (url:string)=>{
   try{
    const {data} = await axios.get(`${partialUrl}/${url}`,{
      withCredentials: true,
    });
    return data

   }catch(error){
    console.log(error)
   }
 }

 const LoadMoreData = async () => {
  const user_friend_data = localStorage.getItem("user_friend")
  const user_friend = JSON.parse(user_friend_data || "[]")
 
  try {
    const { data } = await axios.post(`${partialUrl}/userpost/get_post_body?cursor=${cursor}&random_cursor=${random_cursor}`, {friend:user_friend}, {
      withCredentials: true,
    });
    console.log("loading more context")
    setCards((prev)=>[...data.posts,...prev]); // Assuming data.posts is the array of cards
    setCursor(data.cursor)
    setRandomCursor(data.random_cursor)
   
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    console.error("Error fetching cards:", error);
    if(error?.status === 400){
      setNoMoreCard(true)
    }
    //have to fix this so it should only run when in home page and not in other pages
    // it causes an error when you are not logged in
    if(error?.status === 401){
      /* navigate('/login') */
      console.log("user not logged in")
   
    }
   
  }
};
  return (
    <CardContext.Provider value={{ cards, getComment,userInfo,noMoreCard,LoadMoreData,Socket }}>
      {children}
    </CardContext.Provider>
  );
};


