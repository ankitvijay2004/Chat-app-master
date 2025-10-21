import Link from 'next/link'
import React from 'react'
import { IoClose } from 'react-icons/io5'

const MenuDrawer = ({setMenu,menu,handleLogout}:{setMenu : React.Dispatch<boolean>,menu:boolean,handleLogout:()=>void}) => {
  return (
    <div className={`h-full w-full bg-slate-600 bg-opacity-75 absolute z-50 flex justify-start items-center transition-all duration-500 ease-in-out transform   `} >
          
          <div className={`h-full w-[300px] bg-slate-900  ` } >
            <div className='h-full w-full relative'>
              <button className='absolute right-4 top-4 text-3xl' onClick={() => (setMenu(false))}><IoClose /></button>

              <div className='h-full w-full flex flex-col justify-around items-center '>

                      <div className=' w-full h-[200px] flex flex-col justify-evenly items-center'>
                          <div className='w-5/6 h-[40px] hover:bg-blue-950 flex justify-center items-center delay-75 ease-in-out transition'>
                      <Link href={"/profile/edit"}>Edit Profile</Link>
                          </div>
                          <div className='w-5/6 h-[40px] hover:bg-blue-950 flex justify-center items-center delay-75 ease-in-out transition'>
                      <Link href={"/friends"}>Friends</Link>
                          </div>
                     </div>
                      <button className='w-5/6 h-[40px] bg-blue-500 hover:bg-blue-950 rounded-md  delay-75 ease-in-out' onClick={handleLogout}>logout</button>
                
                
                
             </div>
            </div>

        </div>
      </div>
  )
}

export default MenuDrawer