import {lazy,Suspense,useContext} from 'react'
const Avater = lazy(()=>import('./FriedSuggAv'))
import { ExtraContext } from '@/context/ExtraContext';
const FriendSuggation = () => {
  const {friendSuggation,loading} = useContext(ExtraContext)
  console.log(loading)
  return (
    <div className="bg-white rounded-lg p-4  w-full">
    <h3 className="text-lg font-semibold mb-4">Friend Suggestions</h3>
    <ul >
      {
        loading && <div className=' w-12 h-12 border-t-4 border-b-4 border-blue-500  rounded-t-full rounded-b-full animate-spin'>
          
          </div>
      }
      {!loading && friendSuggation?.map((item) => (
        <Suspense key={item._id} fallback={<div>Loading...</div>}>

          <Avater person={item} key={item._id}/>
        </Suspense>
      ))}
    </ul>
  </div>
  )
}

export default FriendSuggation