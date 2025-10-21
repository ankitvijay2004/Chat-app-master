"use client"

import React, { Children, createContext, use, useCallback, useContext, useEffect, useState } from 'react'
import { io, Socket} from 'socket.io-client'
import { useAuthContext } from './AuthProvider';

interface Friend {
  id: number,
  friendId: number,
  username: string,
  firstname: string,
  lastname: string,
  createdAt: string,
}

interface FriendRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: string;
  createdAt: string;
  sender: {
    id: number;
    username: string;
    firstname: string;
    lastname: string;
  };
}

interface messages{
   message: string, to: string, from: string 
}

interface SocketProviderProps {
  children?: React.ReactNode;
}


interface ISocketContext {
  sendMessage: (msg: string, from:string,to: string) => any;
  sendFriendRequest: (to: string) => void;
  acceptFriendRequest: (from: string) => void;
  declineFriendRequest: (from: string) => void;
  messages: messages[];
  // friends: string[];
  socket?: Socket;
  friends: Friend[];
  setFriends: React.Dispatch<Friend[]>;
  friendRequests: FriendRequest[];
  setFriendRequests: React.Dispatch<FriendRequest[]>;
  setMessageBox: React.Dispatch<string>;
  messageBox: string;
 
}


export const useSocket = () => {
  const state = useContext(SocketContext);
  if (!state) throw new Error(`state is undefined`);

  return state;
};

const SocketContext = createContext<ISocketContext|null>(null)

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [messages, setMessages] = useState<messages[]>([]);
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [messageBox,setMessageBox] = useState<string>("")

  const { handleLogin,isUserLogged , userid } = useAuthContext();



  const sendMessage: ISocketContext["sendMessage"] = useCallback(
    (msg,from,to) => {
      console.log("Send Message", msg,from,to);
      if (socket) {
        socket.emit("message", { message: msg ,from:from,to:to});
      }
    },[socket]
  )
  
  const sendFriendRequest = (to: string) => {
    if(socket)
    socket.emit('send-friend-request', { from: userid, to });
  };

  const acceptFriendRequest = (from: string) => {
    if (socket) {
      socket.emit('accept-friend-request', { from, to: userid });
      setFriendRequests((prev) => prev.filter((user) => user.sender.username !== from));
      // setFriends((prev) => [...prev, from]);
    }
  };

  const declineFriendRequest = (from: string) => {
    if (socket) {
      socket.emit('decline-friend-request', { from, to: userid });
      setFriendRequests((prev) => prev.filter((user) => user.sender.username !== from));
    }
  };
  

  const onMessageRec = useCallback((msgs : { message: string, to: string, from: string }) => {
    console.log("From Server Msg Rec", msgs);
    // const { message } = JSON.parse(msg) as { message: string };
    // const message = msg;
    setMessages((prev) => [...prev, msgs]);
    // setMessages([msg])
    // console.log("from server " ,messages)
  }, []);



  useEffect(() => {
    console.log("Updated messages from server:", messages);
  }, [messages]);








  useEffect(() => {
    const _socket = io("http://localhost:8000", {
      withCredentials:true
    });
  
    _socket.emit('newUser', { userid});
    
    _socket.auth = { userid };
    // _socket.connect();

    // _socket.on("connect_error", (err) => {
    //   if (err.message === "invalid username") {
    //     setIsUserLogged(false);
    //   }
    // });
    _socket.on('messageResponse', onMessageRec);
    setSocket(_socket);


    _socket.on('friend-request-received', ({ friendRequest }) => {
      setFriendRequests((prev) => [...prev, friendRequest]);
    });

    _socket.on('friend-request-accepted', ({ from }) => {
      setFriends((prev) => [...prev, from]);
    });

    _socket.on('friend-request-declined', ({ from }) => {
      setFriendRequests((prev) => prev.filter((user) => user !== from));
    });


    return () => {
      _socket.off("message", onMessageRec);
      _socket.off('friend-request-received');
      _socket.off('friend-request-accepted');
      _socket.off('friend-request-declined');
      _socket.disconnect();
      setSocket(undefined);
    };
  }, []);









  return (
      <SocketContext.Provider value={{sendMessage,sendFriendRequest,messages,friends,setFriends,socket,friendRequests,acceptFriendRequest,declineFriendRequest,messageBox,setMessageBox,setFriendRequests}}>
          {children}
    </SocketContext.Provider>
  )
}

export default SocketProvider