'use client'

import React from 'react'
import { IoClose } from 'react-icons/io5'
import { useSocket } from '../context/SocketProvider'

function UserNotificationcard({ req }: { req: string }): React.ReactNode {
  const { friendRequests,acceptFriendRequest,declineFriendRequest } = useSocket();
  
  return (
    <div className=' h-16 mb-3 rounded-md flex items-center p-4 hover:bg-violet-950 transition'>
      <span className=' w-3/5 text-xl truncate ...'>{req}</span>
    <div className='w-2/5 flex justify-around'>
    <button className='bg-green-950 hover:bg-green-400 transition h-9 w-1/2 rounded-2xl' onClick={()=>acceptFriendRequest(req)}>accept</button>
    <button className='bg-red-950 hover:bg-red-400 transition h-9 w-1/2 rounded-2xl' onClick={()=>declineFriendRequest(req)}>decline</button>
    </div>
  </div>
  )
} 
 
export default function Notifications({ setNotification }: { setNotification: React.Dispatch<boolean> }) {
  const { friendRequests,acceptFriendRequest } = useSocket();
  return (
    // <div>Noti</div>
    <div className='h-full w-full bg-slate-600 bg-opacity-75 absolute z-50 flex justify-center items-center '>
    <div className='h-3/5 w-2/5 bg-slate-900 rounded-xl '>
      <div className='h-full w-full relative'>
        <button className='absolute right-4 top-4 text-3xl z-50' onClick={() => (setNotification(false))}><IoClose /></button>

        <div className='h-full w-full flex flex-col justify-around items-center relative '>
         <div className=' h-10 w-full text-center text-2xl '><h3>Friend Requests</h3></div>
            <div className='h-4/5 w-full pt-4 pb-4 overflow-auto scrollbar-hide  '>
              {
                friendRequests?.map((req) => {
                  const username = req.sender.username;

                  return <UserNotificationcard key={req.senderId} req={username} />
                })
              }

            </div>
   
       </div>
      </div>

  </div>
</div>
  )
}
