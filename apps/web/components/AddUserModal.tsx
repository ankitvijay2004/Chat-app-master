import React, {useState } from 'react'
import { IoClose } from 'react-icons/io5'
import  { useSocket } from '../context/SocketProvider'


const AddUserModal = ({ setAddUserModel }: { setAddUserModel: React.Dispatch<boolean> }) => {
    
    const { setFriends , friends,sendFriendRequest} = useSocket()
    const [user,setUser] = useState<string>("")
    
  const handleAddfriend = () => {
      

    // add the logic for friend request


      sendFriendRequest(user)

        // setFriends([...friends, user]);
        setAddUserModel(false);
    }


  return (
    <div className='h-full w-full bg-slate-600 bg-opacity-75 absolute z-50 flex justify-center items-center '>
          <div className='h-3/5 w-2/5 bg-slate-900 rounded-xl '>
            <div className='h-full w-full relative'>
              <button className='absolute right-4 top-4 text-3xl' onClick={() => (setAddUserModel(false))}><IoClose /></button>

              <div className='h-full w-full flex flex-col justify-around items-center '>
                <div className='h-2/4 w-full flex justify-center items-center' >
                  
                <h1 className=' font-bold text-3xl p-4 '>Add a friend</h1>
                 </div>
                
                <div className='h-2/4 w-full flex flex-col  items-center justify-around'>
                <input type="text" placeholder='username' className='p-4 text-black w-5/6 h-14 border-none outline-none  rounded-md ' onChange={(e)=>{setUser(e.target.value)}} />
                
                <button className='bg-black h-12 w-32  hover:bg-slate-500   rounded-md ' onClick={handleAddfriend}>Add user</button>
                </div>
                
             </div>
            </div>

        </div>
      </div>
  )
}

export default AddUserModal