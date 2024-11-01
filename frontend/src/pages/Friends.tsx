import React from 'react'
import Friend from '@/components/friends/Friend';



const Friends = () => {
    const friends = [
        {
          name: 'Tarikul Islam Tonmoy',
          profileImage: 'https://via.placeholder.com/48', // Placeholder image
        },
        {
          name: 'Sadik Uz Zaman Tarek',
          profileImage: 'https://via.placeholder.com/48',
        },
        {
          name: 'Amirul Millat',
          profileImage: 'https://via.placeholder.com/48',
        },
        {
          name: 'Rishadujjaman Riyad',
          profileImage: 'https://via.placeholder.com/48',
        },
        {
          name: 'MD JF Jim',
          profileImage: 'https://via.placeholder.com/48',
        },
      ];
  return (
    <div className=' w-full min-h-dvh  flex   justify-center items-center mt-8 '>

   
    <div className=" w-full flex flex-col justify-center items-center">
      <h2 className=" text-2xl sm:text-4xl  font-bold mb-4  text-gray-950">Active Friends</h2>

      {/* Render Friend Components */}
      <div className=' w-full flex flex-col justify-center items-center  max-h-[800px] overflow-y-auto'>

      
      {friends.map((friend, index) => (
        <Friend
          key={index}
          name={friend.name}
          profileImage={friend.profileImage}
        />
      ))}
      </div>
    </div>
  
    </div>
  )
}

export default Friends