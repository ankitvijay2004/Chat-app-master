"use client"
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import SocketProvider, { useSocket } from "../context/SocketProvider";
import { UserLogin } from "../components/UserLogin";
import { useAuthContext } from "../context/AuthProvider";
import { useRouter } from "next/navigation";
import axios, { Axios, AxiosError } from "axios";


export default function Page(): JSX.Element {
  
  // const { setUserid, isUserLogged, setIsUserLogged } = useSocket();
  const { handleLogin,isUserLogged ,setIsUserLogged,setUserid} = useAuthContext();
const router = useRouter()
  // const [message, setMessage] = useState("");
  // const [userid, setUserid] = useState("");
  // console.log("from list of messages:" , messages)

  // if (!isUserLogged) router.push('/login')
  
  // if (isUserLogged) router.push('/chats')
  

  useEffect(() => {
    
    if (!isUserLogged) router.push('/login')
  
    if (isUserLogged) router.push('/chats')
    
  
  }, [isUserLogged]);

  
  useEffect(() => {

      const checkAuthStatus = async () => {
        try {
          console.log("11")
          const response = await axios.get('http://localhost:8000/api/protected', { withCredentials: true });
  
          console.log(response)
          if (response.status === 200) {
            console.log("User is authenticated");
            setUserid(response.data.user.username)
            setIsUserLogged(true);

          }
        } catch (error:any) {
          if (error.response && error.response.status === 403) {
            router.push('/login');
          }
        }
      };
  
      
        checkAuthStatus();
    
    }, [isUserLogged]);
  
 
  return (
<div>  
<div>

        {/* {isUserLogged ? <SocketProvider> <Home /> </SocketProvider>  : <UserLogin handleLogin={handleLogin} />} */}
        {/* {!isUserLogged && <UserLogin handleLogin={handleLogin} />} */}
        
        
        
    </div>
</div>
  );
}
   
