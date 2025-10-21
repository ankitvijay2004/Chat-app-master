'use client'

import React, { useState ,useEffect,useRef} from 'react'
import { useSocket } from './../context/SocketProvider'
import { IoMdSend } from 'react-icons/io'
import { useAuthContext } from './../context/AuthProvider'

function MessageBox() {
    const { messageBox, sendMessage,messages } = useSocket()
    const {userid} = useAuthContext()
    const [text, setText] = useState<string>("")
    console.log("mB", messages)
    
    const messageEndRef = useRef<HTMLDivElement | null>(null);
  
    const scrollToBottom = () => {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
        
    }, [messages,messageBox]);
  
  return (
    <div className=' w-full h-[640px]  flex flex-col justify-end pt-4 pb-4 overflow-auto  '>
    <div className=' w-full overflow-y-auto scrollbar-hide ' >
             
      {
        messages.map((msg) => {
          if (msg.from === messageBox && msg.to === userid) {
            return  <div className='w-full min-h-12   '>
            <div className='max-w-96  bg-slate-700 min-h-12 m-4 ml-10 rounded-r-lg rounded-bl-lg p-3 inline-block whitespace-normal break-words '>
            <span>{msg.message}</span>
            </div>
           </div>
          }

          if (msg.from === userid && msg.to === messageBox) {
            return  <div className='w-full min-h-12   flex justify-end '>
            <div className='max-w-96  bg-slate-700 min-h-12 m-4 mr-10 rounded-l-lg rounded-br-lg inline-block whitespace-normal break-words p-3 '>
                <span>{msg.message}</span>
            </div>
            </div>
          }
        })
      } 
      
        <div ref={messageEndRef}></div>
    </div>
    </div>

  )
}

export default MessageBox