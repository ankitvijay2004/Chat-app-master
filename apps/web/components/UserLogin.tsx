import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
interface UserLoginProps {
  handleLogin: ({ username , password}:{username:string,password:string}) => void;
  }



export const UserLogin : React.FC<UserLoginProps> = ({handleLogin} ) => {
    const [username,setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const router = useRouter()

  const handlesubmit = (e:React.FormEvent) => {
    e.preventDefault();
    handleLogin({ username, password })
    router.push('/')
  }
  return (
<main className='h-screen w-full flex justify-center items-center'>
          <div className='h-3/4 w-2/4 bg-slate-700 rounded-lg flex flex-col justify-around'>
              <h1 className='text-center text-3xl font-semibold'>Login</h1>

        <div className='h-2/4 w-full '>
          


          <form className='h-full w-full flex flex-col justify-around items-center' onSubmit={handlesubmit}>
            <div className=' w-full flex items-center pl-10'>
            <label className=' w-24' htmlFor="username">Username :</label>
              <input type="text" name='username' className='w-2/4 ml-28 h-10 p-4  text-black outline-none' placeholder='username' onChange={(e)=>{setUsername(e.target.value)}}/>     
            </div>
            
            <div className='w-full flex items-center pl-10'>
            <label className=' w-24' htmlFor="password">Password :</label>
              <input type="password" name='password' className='w-2/4 ml-28 h-10 p-4  text-black outline-none' placeholder='password' onChange={(e)=>{setPassword(e.target.value)}}/>
                      
          </div>
              <button className="h-10 hover:bg-slate-500 w-20  rounded-md" >
              login
            </button>
          </form>   
          


          <div className='w-full flex justify-center items-center'>
          <span>Don't have an account ? <Link className='text-green-300 underline' href={"/register"}>Sign up.</Link></span>
         </div>
              </div>              
          </div>
    </main>
  )
}
