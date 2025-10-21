'use client'
import React, { useEffect } from 'react'
import { UserReginster } from '../../components/UserReginster'
import { useAuthContext } from '../../context/AuthProvider'
import { useRouter } from 'next/router';

function Chatpage() {
    const { handleRegister} = useAuthContext();
    // const { handleRegister, isUserLogged } = useAuthContext();
    // const router = useRouter()

    // useEffect(() => {
    //     if (isUserLogged) {
    //         router.push('/');
    //     }
    // }, [isUserLogged, router]);
  return (
      <div>
          <UserReginster handleRegister={handleRegister} />
    </div>
  )
}

export default Chatpage