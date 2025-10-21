'use client'
import React, { useEffect } from 'react'
import { UserLogin } from '../../components/UserLogin'
import { useAuthContext } from '../../context/AuthProvider';
import { useRouter } from 'next/navigation';

function Loginpage() {
    const { handleLogin, isUserLogged } = useAuthContext();
    // const router = useRouter()
 
    // console.log(isUserLogged)
    //     if (isUserLogged) router.push('/chats')
     

  return (
    <div>  
<div>

        {/* {isUserLogged ? <SocketProvider> <Home /> </SocketProvider>  : <UserLogin handleLogin={handleLogin} />} */}
        <UserLogin handleLogin={handleLogin} />
        
    </div>
</div>
  )
}

export default Loginpage