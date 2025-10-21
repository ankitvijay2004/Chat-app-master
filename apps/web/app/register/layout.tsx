'use client'
import React, { useEffect } from 'react'
import { useAuthContext } from '../../context/AuthProvider';
import { useRouter } from 'next/navigation';

function RegisterLayout({ children }: { children: React.ReactNode }) {
    // const { handleRegister, isUserLogged } = useAuthContext();
    // const router = useRouter()

    // console.log(isUserLogged)
   
    // useEffect(() => {
    //     if (isUserLogged) {
    //         router.push('/');
    //     }
    //    },[router])
   
    
  return (
      <div>{children}</div>
  )
}

export default RegisterLayout