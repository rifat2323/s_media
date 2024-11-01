
import { lazy} from 'react';
const StoriesImg = lazy(()=>import('./StoriesImg'))


import UserProfile from '../common/UserProfile';

const Profiles = () => {
  
  return (
   <UserProfile >
     {
        Array.from({length:25}).map((_,index)=>(
          <StoriesImg key={index}/>
        ))
      }
   </UserProfile>
  )
}

export default Profiles