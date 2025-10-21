"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { createContext, useContext } from 'react'
import Cookies  from 'js-cookie';
import { useRouter } from 'next/navigation';
interface AuthProviderProps {
    children?: React.ReactNode;
  }
  
interface register{
  firstname: string,
  lastname: String,
  username: String,
  password: String
  }

interface IauthContext{
  handleLogin: ({ username , password}:{username:string,password:string}) => void;
  userid: string;
  setUserid: React.Dispatch<string>
  isUserLogged: boolean;
  setIsUserLogged: React.Dispatch<boolean>;
  handleRegister: (data: register) => Promise<void>;
  handleLogout: () => void;
}


export const useAuthContext = () => {
    const state = useContext(AuthContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
}

const AuthContext = createContext<IauthContext|null>(null)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {

    const [userid, setUserid] = useState<string>("");
    const [isUserLogged, setIsUserLogged] = useState(false)

  const router = useRouter();

  const handleLogout = async () => {
    Cookies.remove("token");
    setIsUserLogged(false);
    router.push('/')
  }
    
    const handleLogin = async ({username,password}:{username:string,password:string}) => {
      // localStorage.setItem('userName', );
      try {
        const response = await axios.post('http://localhost:8000/api/login', { username, password })
        console.log("jjjj",response)
        const token = "Bearer " + response.data.token;
    
        Cookies.set('token', token, { expires: 7 })
        setUserid(response.data.user.username)
        setIsUserLogged(true)
        router.push('/');
      } catch (error) {
        console.log(error);
      }
    
  }


  
   const handleRegister = async (data:register) => {

     console.log("from register handler")
     try {
  
       const response = await axios.post('http://localhost:8000/api/register', data)
       const token = "Bearer " + response.data.token;
       console.log(token);
       Cookies.set('token', token, { expires: 7 })
       setIsUserLogged(true)
       console.log(response);
       router.push('/');
       
    } catch (error) {
      console.log(error);
    }
  }
  



    

  return (
      <AuthContext.Provider value={{handleLogin,userid,setUserid,isUserLogged,handleRegister,setIsUserLogged,handleLogout}}>
          {children}
    </AuthContext.Provider>
  )
}
 

