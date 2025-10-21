'use client'
import { useRouter } from 'next/navigation';
import React from 'react'
import { useAuthContext } from '../../context/AuthProvider';

function Loginlayout({ children }: { children: React.ReactNode }) {
    // const { handleLogin, isUserLogged } = useAuthContext();
    // const router = useRouter()
    // console.log(isUserLogged)
    // if (isUserLogged) {
    //   router.push("/chats") 
    //   return null
    // }
  return (
      <div>{children}</div>
  )
}

export default Loginlayout