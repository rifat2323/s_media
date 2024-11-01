import { create } from 'zustand';

type Card = {
  [key: string]: string | boolean | number | Date ;
 
};

type State = {
  cards: Card[];
  courser: null | string;
  courser_2: null | string;
};

type Actions = {
  updateCard: (newCard: Card) => void;
  updateCourser:(courser:string)=>void
  updateCourser_2:(courser:string)=>void
};

const useCardStore = create<State & Actions>((set) => ({
  cards: [],
  courser:null,
  courser_2:null,
  updateCard: (newCards) => set((state) => ({
    cards: Array.isArray(newCards) 
      ? [...state.cards, ...newCards]  
      : [...state.cards, newCards]     
  })),
  updateCourser:(courser)=>set(()=>({
 courser:courser
  })),
  updateCourser_2:(courser)=>set(()=>({
    courser_2:courser
  })),


}));

export default useCardStore;
