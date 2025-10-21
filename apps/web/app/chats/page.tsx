'use client'
import React, { useEffect } from 'react'
import { useState } from "react";
import AddUserModal from '../../components/AddUserModal';
// import Notifications from '../../components/Notifications'
import { IoMenu, IoPersonAdd } from 'react-icons/io5'
import SocketProvider, { useSocket } from '../../context/SocketProvider';
import { IoIosNotifications } from 'react-icons/io';
import Notifications from '../../components/Notifications';
import Link from 'next/link';
import MenuDrawer from '../../components/MenuDrawer';
import { useAuthContext } from '../../context/AuthProvider';
import axios from 'axios';

export default function Chatpage() {
  const [addUserModel, setAddUserModel] = useState(false);
  const [notification, setNotification] = useState(false);
  const [menu, setMenu] = useState(false);
  const { handleLogout } = useAuthContext();
  const {setFriendRequests,friendRequests,setFriends,friends} = useSocket()
  
  const handleNotification = () => {
    setNotification(true)
  }



  useEffect(() => {
    const getFriendRequests = async () => {
      try {
        console.log('making request for fries');
        const friendRequestResponse : any = await axios.get('http://localhost:8000/api/friendrequests', { withCredentials: true });
        const friendListResponse : any = await axios.get('http://localhost:8000/api/friends', { withCredentials: true });
        
        console.log("Full friend Request Response:", friendRequestResponse); // Log the full friendRequestResponse
        console.log("Full friend list Response:", friendListResponse); // Log the full friendRequestResponse
        
        const listfriendReq = friendRequestResponse.data; // Get the friendrequestlist
        const listfriends = friendListResponse.data; // Get the friendrequestlist
        
        if (Array.isArray(listfriendReq)) {
          // throw new TypeError('friendrequestlist is not an array');
          const uniqueFriendRequests = [...new Set([...friendRequests, ...listfriendReq])];
          setFriendRequests(uniqueFriendRequests);

        }
        if (Array.isArray(listfriends)) {
          // throw new TypeError('friendlist is not an array');
          const uniqueFriendslist = [...new Set([...friends, ...listfriends])];
          setFriends(uniqueFriendslist);

        }
  
        console.log("from lis", listfriendReq);
        console.log("from frds", listfriends);
  
      } catch (error) {
        console.error("Error fetching friend requests and friends:", error);
      }
    };
  


    getFriendRequests();

  },[])




  return (
 

    <div >
      
       {addUserModel && <AddUserModal setAddUserModel={setAddUserModel} /> }
      {notification && <Notifications setNotification={setNotification} /> }
      {menu && <MenuDrawer setMenu={setMenu} menu={menu} handleLogout={handleLogout} /> }

      <div className='w-full h-32 relative'>



        <div className='w-full h-full '>
         
          {/* <div className='bg-gray-300 w-2/5 flex items-center'>
            <button>b</button>
          </div> */}
          
          <div className='w-full  h-16  flex justify-around'>
            <div className='h-16  w-1/5 flex items-center justify-center'>
            <button className='text-3xl' onClick={()=>(setMenu(true))}><IoMenu /></button>
        </div>
            <div className='h-16 w-3/5  text-center'>
            <h1 className=' font-bold text-2xl p-4 h-16'>Chats</h1>
          </div>
        
        <div className=' text-2xl  h-16 w-1/5 flex justify-around items-center '>
          <button onClick={()=>(setAddUserModel(true))}><IoPersonAdd/></button>
          <button onClick={()=>(handleNotification())}><IoIosNotifications /></button>
          </div>
          
          </div>
          



          <div className=' w-full h-16  p-2'>
          <input type="text" placeholder='search' className='w-full h-12 p-4 border-none outline-none  rounded-md bg-slate-700 ' />
          </div>
          
        </div>




        
      </div>

      

    </div>
  )
}
