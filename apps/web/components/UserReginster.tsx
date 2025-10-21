import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

interface UserRegisterProps{
  handleRegister: (formData: register) => void;
}

interface register{
  firstname: string,
  lastname: string,
  username: string,
  password: string
  }

export const UserReginster : React.FC<UserRegisterProps> = ({ handleRegister }) => {
    const [username,setUsername] = useState("")
    const [password,setPassword] = useState("")
    const [firstname,setfirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const router = useRouter()
  
  const [formData, setFormData] = useState<register>({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
  });


  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

  }

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    handleRegister(formData);
    router.push('/')

}




  return (
    <main className='h-screen w-full flex justify-center items-center'>
          <div className='h-3/4 w-2/4 bg-slate-700 rounded-lg flex flex-col justify-around'>
              <h1 className='text-center text-3xl font-semibold'>Login</h1>

              <div className='h-2/4 w-full '>
                  
            <form className='h-full w-full flex flex-col justify-around items-center' onSubmit={handleSubmit}>
                      

            <div className=' w-full flex items-center pl-10'>
            <label className=' w-24' htmlFor="firstname">Firstname :</label>
              <input type="text" name='firstname' className='w-2/4 ml-28 h-10 p-4  text-black outline-none' placeholder='firstname'value={formData.firstname}
            onChange={handleInputChange}
            required/>     
            </div>
            <div className=' w-full flex items-center pl-10'>
            <label className=' w-24' htmlFor="lastname">Lastname :</label>
              <input type="text" name='lastname' className='w-2/4 ml-28 h-10 p-4  text-black outline-none' placeholder='lastname' value={formData.lastname}
            onChange={handleInputChange}
            required/>     
            </div>
            <div className=' w-full flex items-center pl-10'>
            <label className=' w-24' htmlFor="username">Username :</label>
              <input type="text" name='username' className='w-2/4 ml-28 h-10 p-4  text-black outline-none' placeholder='username' value={formData.username}
            onChange={handleInputChange}
            required/>     
            </div>
            <div className='w-full flex items-center pl-10'>
            <label className=' w-24' htmlFor="password">Password :</label>
              <input type="password" name='password' className='w-2/4 ml-28 h-10 p-4  text-black outline-none' placeholder='password'      value={formData.password}
            onChange={handleInputChange}
            required  />         
            </div>

              <button className="h-10 hover:bg-slate-500 w-20  rounded-md"  type='submit'>
              Sign up
            </button>
          </form>   
          
          <div className='w-full flex justify-center items-center'>
          <span>Already have an account ? <Link className='text-green-300 underline' href={"/login"}>Log in.</Link></span>
         </div>
              </div>              
          </div>
    </main>
  )
}
