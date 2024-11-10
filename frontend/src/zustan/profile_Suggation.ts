
import { AxiosResponse } from 'axios'
import {create} from 'zustand'
import Post_Datas from '@/utils/fecthing/postDatas'

type people= {
    name: string;
    _id:string
    profilePicture: string;
  }[]

interface state{
    data: people | [] | null,
    noMoreSuggestion:boolean,
    page:number
    getMoreSuggestion:(page?:number )=>void
    loading: boolean;
    incasePage:()=>void
}




export const useProfileSuggation = create<state>((set)=>({
    data:[],
    noMoreSuggestion:false,
    page:0,
    loading:false,
    getMoreSuggestion: async (page =0)=>{
        set({ loading: true });
        const user_friend_data = localStorage.getItem("user_friend")
        const user_friend = JSON.parse(user_friend_data || "[]")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const {error,response}:{ response: AxiosResponse<people> | null, error: any } = await Post_Datas(`user_friend/get_friend_suggestion?page=${page}`,{user_friend})

        if(!error && response){
            set((state) => ({
                data:[...(state.data || []),...(response.data || [])],
            }))
            set({ loading: false });
        }else{
            console.error("Failed to fetch friends:", error);
            if(error.status === 404){
                set({noMoreSuggestion:true})
            }
            set({ loading: false });
        }
    },
    incasePage:()=>set((state)=>({page:state.page+1}))
      

}))




