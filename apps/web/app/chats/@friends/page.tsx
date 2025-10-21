'use client'
import React from 'react'
import { useSocket } from "../../../context/SocketProvider"

export default function Friendspage() {
  const {friends,setMessageBox,messageBox} = useSocket()
  // const { sendMessage, messages,friends } = useSocket()
  console.log(messageBox)
  return (
    <div className=' h-[81vh] '>
      
       <div className=' w-full h-full pt-4 pb-4 overflow-auto scrollbar-hide  '>

{friends.map((e) => (
    <div key={e.id} className=' h-16 mb-3 rounded-md flex items-center p-4 hover:bg-emerald-950 transition' onClick={()=>(setMessageBox(e.username))} >
      {e.username}
    </div>
))}


</div>
    </div>
  )
}
