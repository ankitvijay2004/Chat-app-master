import express from 'express';
import { Server ,Socket} from 'socket.io';
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import jwt, { JwtPayload } from 'jsonwebtoken'; 
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser'
import cookie from 'cookie';
import { authmiddleware,  requestwithuser } from './middleware/authmiddleware'
dotenv.config()

interface friendrequestslist{
  [username: string]: string[];
 }


let users: user[] = [];
let i: user|undefined = {};
let friendRequests : friendrequestslist = {}; // { username of to : [friendRequestUsernames] }
let friends : friendrequestslist = {}
// let allUsers = {}


// Extend the Socket interface
interface CustomSocket extends Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
  username?: string;
}
interface user{ username?: string, socketID?: string }

 




const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  credentials:true
}));
app.use(cookieParser())
app.use(express.json());
export const prisma = new PrismaClient();
app.use(bodyParser.json())

 
app.get('/api', async (req, res) => {
  console.log('test api ')
  res.json({ message: "good" })
})

 
app.get('/api/protected', async (req, res) => {
  const cookie = req.cookies;
  const token = cookie.token ? cookie.token.split(' ')[1] : null;

  if (!token) {
      return res.status(401).json({ message: "User not logged in." }); // 401 Unauthorized
  }
  try {
    // Verify the token
    const decoded  =  jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key') as JwtPayload;
    const user = await prisma.user.findUnique({ where: { id:decoded.userId } }); 

    // If the verification is successful, send a success response
    return res.status(200).json({ message: "Access granted", user});
} catch (error) {
    // Handle token verification errors

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token has expired. Please log in again." }); // Token expired
  }
    return res.status(403).json({ message: "Invalid token." }); // 403 Forbidden
}
})



app.post('/api/register', async (req, res) => {
 
  const { username, password, firstname, lastname } = req.body;
  
  const hashedpassword = await bcrypt.hash(password, 10);

  try {

  const user = await prisma.user.create({
    data: {
      username, password: hashedpassword, firstname,lastname
    }
  })
    // console.log(process.env.JWT_SECRET)
    const token =  jwt.sign({userId:user.id},process.env.JWT_SECRET || 'fallback-secret-key',{expiresIn: '1h'})

    res.status(201).json({ message: 'User registered', user ,token});
    
  } catch (error) {
    res.status(400).json({error:"User Already Exists "})
  }

})



app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({ where: { username } }); 

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(400).json({error:"Invalid Credentials"})
  }

  const token =  jwt.sign({userId:user?.id},process.env.JWT_SECRET || 'fallback-secret-key',{expiresIn: '1h'})
  res.status(201).json({ message: 'User Logged in', user ,token});
  } catch (error) {
    res.status(400).json({error:"Invalid Credentials"})

  }


}) 

app.get('/api/friendrequests',authmiddleware, async (req, res) => {
  // console.log("list of friendreq",friendRequests)
  // console.log(friendRequests[user.username])
  try {
    const user = (req as requestwithuser).user
    const friendRequests = await prisma.friendRequest.findMany({
      where: {
        AND: 
          [{receiverId : user.id},{status:'PENDING'}],
      },
      include: {
        sender:true,
      }
    })
    console.log(friendRequests);
    res.status(200).json(friendRequests)
  
} catch (error) {
  console.error(error);
    res.status(500).json({ error: "Failed to fetch friend requests" });
}
  

})


app.get('/api/friends',authmiddleware, async (req, res) => {
  // console.log("list of frinds",friends)
  // console.log(friends[user.username])
  
  try {
    const user = (req as requestwithuser).user
    const friends = await prisma.friend.findMany({
      where: {
        OR:[{ user1Id: user.id },{user2Id:user.id}]
      },
      include: {
        user: true,   // Includes User data for `user1Id`
        friend: true, // Includes User data for `user2Id`
      },
    })

    const formattedFriendList = friends.map((friend) => {
      const friendUser = friend.user1Id == user.id ? friend.friend : friend.user;
      return {
        id: friend.id,
        friendId: friendUser.id,
        username: friendUser.username,
        firstname: friendUser.firstname,
        lastname: friendUser.lastname,
        createdAt: friend.createdAt,
      }
    })
    res.status(200).json(formattedFriendList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch friends list" });
  }


})














const server = app.listen(8000, () => {
  console.log('Application started on port 8000!');
});







const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Frontend origin
    methods: ['GET', 'POST'],  // Allowed methods
    credentials: true  // Allow credentials (cookies, tokens)
  }
});




io.use((socket, next) => {
  
  const cookieHeader = socket.request.headers.cookie;

  if (!cookieHeader) {
    return next(new Error("Authentication Error - No Cookies"));
  }

  const cookies = cookie.parse(cookieHeader);
  const token = cookies.token.split(' ')[1];
    if (!token) return next(new Error("Authentication Error"));

  try {
      
    const decoded = jwt.verify(token,  process.env.JWT_SECRET || 'fallback-secret-key');
    next();
      
  } catch (error) {
    return next(new Error("Authentication error - Invalid Token"));
    //   if (error instanceof jwt.TokenExpiredError) {
    //     return res.status(401).json({ message: "Token has expired. Please log in again." }); // Token expired
    // }
    // return res.status(403).json({ message: "Invalid token." }); // 403 Forbidden
  }
});





io.on('connection', (socket) => {
  console.log(`User connected ${socket.id}`)


  socket.on('message', (e) => {
    try {
      console.log(e);
      users.forEach((user) => {
        if (user.username === e.to && user.socketID) {
          io.to(user.socketID).emit('messageResponse', { message: e.message, to: e.to, from: e.from });
        } else if (user.username === e.from && user.socketID) {
          io.to(user.socketID).emit('messageResponse', { message: e.message, to: e.to, from: e.from });
        }
      });
    } catch (error) {
      console.error('Error handling message:', error);
      socket.emit('error', 'An error occurred while processing the message.');
    }
    
  })




  socket.on('newUser', (data) => {

    try {
      const newUser = { username: data.userid, socketID: socket.id };
      users.push(newUser);
      console.log("New user joined", users);
      io.emit('newUserResponse', users);
    } catch (error) {
      console.error('Error adding new user:', error);
      socket.emit('error', 'Failed to add new user.');
    }

    
  });

  socket.on('disconnect', () => {
    try {
      console.log('A user disconnected');
      users = users.filter((user) => user.socketID !== socket.id);
      io.emit('newUserResponse', users);
      socket.disconnect();
    } catch (error) {
      console.error('Error during disconnect:', error)
    }

  });



  socket.on('send-friend-request', async ({ from, to }) => {

    try {
      // console.log("from",from ,"to ",to)
      const sender = await prisma.user.findUnique({ where: { username: from }, select: { id: true } });
      const receiver = await prisma.user.findUnique({ where: { username: to }, select: { id: true } });
    
      if (sender && receiver) {
        const existFriendRequest = await prisma.friendRequest.findFirst({
          where: {senderId: sender.id, receiverId: receiver.id },
        })
        const existFriendRequestReverse = await prisma.friendRequest.findFirst({
          where:{senderId:receiver.id,receiverId:sender.id}
        })
        if (existFriendRequestReverse && existFriendRequestReverse.status === 'ACCEPTED') {
          return socket.emit('error', 'Your Are Already Friends with the User');
        }
          
        if (existFriendRequest) {
          if (existFriendRequest.status === 'DECLINED') {
            const friendRequest = await prisma.friendRequest.update({
              where:{id:existFriendRequest.id},
              data: { status: 'PENDING' },
              include:{sender:true}
            })
            users.forEach((user) => {
              if (user.username === to && user.socketID) {
                io.to(user.socketID).emit('friend-request-received', { friendRequest });
              } else {
                socket.emit('user-not-found', to);
              }
            });

          }
          else if (existFriendRequest.status === 'PENDING') {
            return socket.emit('error', 'Friend request already pending.');
          } else if (existFriendRequest.status === 'ACCEPTED') {
            return socket.emit('error', 'Your Are Already Friends with the User');
            
          }

          
        } else {
          
          const friendRequest = await prisma.friendRequest.create({
            data: {
              senderId: sender.id,
              receiverId: receiver.id,
            },
            include: { sender:true }
          });

          users.forEach((user) => {
            if (user.username === to && user.socketID) {
              io.to(user.socketID).emit('friend-request-received', { friendRequest });
            } else {
              socket.emit('user-not-found', to);
            }
          });
        }

      }
    }
    catch (error) {
      console.error('Error sending friend request:', error);
      socket.emit('error', 'Failed to send friend request.');
    }
    
  })


  socket.on('accept-friend-request', async ({ from, to }) => {

    try {
      const sender = await prisma.user.findUnique({ where: { username: from }, select: { id: true } });
      const receiver = await prisma.user.findUnique({ where: { username: to }, select: { id: true } });


      if (sender && receiver) {
        await prisma.friendRequest.update({
          data: { status: 'ACCEPTED' }, where: {
            senderId_receiverId: {
              senderId: sender.id, receiverId: receiver.id
            }
          }
        })


        await prisma.friend.create({
          data: {
            user1Id: sender.id,
            user2Id: receiver.id
          }
        })
       
      }



      users.map((user) => {
        if (user.username === from) {


          if (user.socketID) {
            io.to(user.socketID).emit('friend-request-accepted', { from: to });
          }
        }
      
        if (user.username === to) {
          if (user.socketID) {
            io.to(user.socketID).emit('friend-request-accepted', { from });
          
          }
        }
      })

    }
    catch (error) {
      console.error('Error accepting friend request:', error);
      socket.emit('error', 'Failed to accept friend request.');
    }

})

  
  
  
  
  
   // Decline a friend request
   socket.on('decline-friend-request', async ({ from, to }) => {
     try {
       const sender = await prisma.user.findUnique({ where: { username: from }, select: { id: true } });
       const receiver = await prisma.user.findUnique({ where: { username: to }, select: { id: true } });
       if (sender && receiver) {
      
         await prisma.friendRequest.update({
           data: { status: 'DECLINED' },
           where: {
             senderId_receiverId: { senderId: sender.id, receiverId: receiver.id }
           }
         })
       }
  
       users.map((user) => {
         if (user.username === from) {
        
           if (user.socketID) {
             io.to(user.socketID).emit('friend-request-declined', { from: to });

           }
        
         }
       })

     }
     catch (error) {
      console.error('Error declining friend request:', error);
      socket.emit('error', 'Failed to decline friend request.');
     }

});


 


  
});

