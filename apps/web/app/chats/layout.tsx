'use client'
import React, { useEffect } from 'react'
import SocketProvider from "../../context/SocketProvider";
import AddUserModal from '../../components/AddUserModal';
import { useAuthContext } from '../../context/AuthProvider';
import { useRouter } from 'next/navigation';


export default function Chatlayout({ children, friends,messages }: { children: React.ReactNode, friends: React.ReactNode,messages:React.ReactNode }) {

  const { isUserLogged,userid } = useAuthContext();
  const router = useRouter()

  console.log("cccccccccccc", isUserLogged)
  console.log(" ", userid)
  // if (!isUserLogged) {
  //   router.push("/");
  //   // return null
  // }
 useEffect(() => {
  if (!isUserLogged) {
    router.push("/") 
  }
 }, [])
 
  
  return (
    <>
    <div className='flex h-screen'>
      <SocketProvider>
          <div className='w-2/6 '>
          {children}
          {friends}
          </div>
          <div className='w-4/6'>
          {messages}
          </div>
      </SocketProvider>
      </div>
    </>
  )
}
