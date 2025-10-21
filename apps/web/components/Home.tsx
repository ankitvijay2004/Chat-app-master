import React from 'react'
// import styles from "./page.module.css";
import styles from "../app/page.module.css"
import { IoPersonAdd,IoClose } from "react-icons/io5";
import { useState } from "react";
import { useSocket } from "../context/SocketProvider";
import AddUserModal from './AddUserModal';

export const Home = () => {
    let i = 0;
    const { sendMessage, messages,friends } = useSocket();
    const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [addUserModel,setAddUserModel ] = useState(false);
  

 
  return (
    <main className="h-screen w-full flex font-sans ">

      {addUserModel && <AddUserModal setAddUserModel={setAddUserModel} /> }


      <div className='h-full w-2/6 '>
        <div className='w-full h-16 relative'>
          <h1 className=' font-bold text-2xl p-4'>Chats</h1>
          <div className='text-2xl absolute top-5 right-5 '>
            <button onClick={()=>(setAddUserModel(true))}><IoPersonAdd/></button>
          </div>
        </div>

        <div className='w-full h-16  p-2'>
          <input type="text" placeholder='search' className='w-full h-12 p-4 border-none outline-none  rounded-md bg-slate-700 ' />
        </div>
        <div className=' w-full h-[80vh] pt-4 pb-4 overflow-auto scrollbar-hide  '>

          {friends.map((e) => (
            
            <div className=' h-16 mb-3 rounded-md flex items-center p-4 hover:bg-emerald-950 transition'><span >{e}</span></div>
          ))}


        </div>
      </div>






      <div className='h-full w-4/6 '>
        messages
      </div>


      
    {/* <div className="w-full h-80">
          <div className="w-full h-2/4 flex justify-around">
            <input className="h-10 rounded-sm p-4 text-black "
              onChange={(e) => setMessage(e.target.value)}
             
              placeholder="Message..."
              />
              <input type="text" className="h-10 p-4 text-black" placeholder="username" onChange={(e)=> setUsername(e.target.value)}/>
    
    
              <button className="h-10 hover:bg-slate-500 w-20  rounded-md"
                onClick={(e) => {
                  sendMessage(message,username)
                }}
              
            >
              Send
            </button>
          </div>
            <div className="text-white w-full h-80">
              <h2>Messages:</h2>
              {messages.map((e) => (
              <li  key={i++}>{e}</li>
            ))}
          </div>
        </div>
          */}
        </main>
  )
}
