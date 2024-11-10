import Post_Datas from '@/utils/fecthing/postDatas'
import { AxiosResponse } from 'axios'
import {create} from 'zustand'
type data = {
    _id:string,
    userId:{
      name:string,
      _id:string,
      profilePicture:string
    },
    createdAt:string
  }
interface state{
    story:data[],
    cursor:string,
    getData:(cursor?:string)=>void,
    inViws:boolean,
    setInViw:()=>void,
    getMoreData:(cursor?:string)=>void
}



type apiReq ={
    friends:data[],
    sendCursor:string
}


export const useStory = create<state>((set)=>({
    story:[],
    cursor:'',
    inViws:false,
    getData: async (cursor='')=>{
        const user_friend_data = localStorage.getItem("user_friend")
        const user_friend = JSON.parse(user_friend_data || "[]")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {error,response}:{response:AxiosResponse<apiReq> | null,error:any} = await Post_Datas(`user_stroies/get_poster_story?cursor=${cursor}`,{user_friend})
        if(error || !response){
            console.log(error)
            return
        }
        set(()=>({
            story:[...response.data.friends],
            cursor:response.data.sendCursor
        }))
    },
    getMoreData: async (cursor='')=>{
        const user_friend_data = localStorage.getItem("user_friend")
        const user_friend = JSON.parse(user_friend_data || "[]")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {error,response}:{response:AxiosResponse<apiReq> | null,error:any} = await Post_Datas(`user_stroies/get_poster_story?cursor=${cursor}`,{user_friend})
        if(error || !response){
            console.log(error)
            return
        }
        set((state)=>({
            story:[...state.story,...response.data.friends],
            cursor:response.data.sendCursor
        }))
    },
    setInViw :()=>set({inViws:true})
}))
