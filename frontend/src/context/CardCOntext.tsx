import React, { createContext,  useEffect, useState } from 'react';
import axios from 'axios';

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
  _id:string

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
  }
};
type user = {
  id:string,
    name:string,
    img:string | null,
    coverPhoto:string
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
    }
});


export const CardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [userInfo, setUserInfo] = useState<user >({ id:'0',
    name:"placeholder",
    img:"https://placehold.co/50x50",
    coverPhoto:''

  });

  const [cursor,setCursor] = useState('')
  const [random_cursor,setRandomCursor] = useState('')


 useEffect(() => {
  const user_info = JSON.parse(localStorage.getItem("user_info") as string);
  setUserInfo(user_info)
  
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
        setCards(data.posts); // Assuming data.posts is the array of cards
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


  return (
    <CardContext.Provider value={{ cards, getComment,userInfo }}>
      {children}
    </CardContext.Provider>
  );
};


