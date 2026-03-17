import {Server} from "socket.io"
import crypto from "crypto"
import { redis } from "../Config/redisConfig.js"


function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const bytes = crypto.randomBytes(6) || [0, 0, 0, 0, 0, 0]

  let code = ""

  for (let i = 0; i < 6; i++) {
    code += chars[(bytes[i]!) % chars.length]
  }

  return code
}


interface Roomtype {
    owner : string, 
    collaborators : Set<string>
}
const rooms = new Map<string, Roomtype>() ;

const idTosocket = new Map() ;
const socketToid = new Map() ;
const idTorooms = new Map<string, string> () ;


export const initSocket = (io: Server) => {
    

    io.on("connection", async(socket) => {
        
        console.log("User Connected",  socket.id) ;
        socket.data.userId = socket.handshake.auth.id ;
        // const roompresent = idTorooms.get(socket.data.userId) ;
        const roompresent = await redis.get(`user:${socket.data.userId}:room`) ;
       
        if(roompresent) {
            socket.emit("joined-room", (roompresent)) ;
            
            socket.join(roompresent) ;
            socket.data.roomcode = roompresent ; 
        }

       
        idTosocket.set(socket.data.userId, socket.id) ;
        socketToid.set(socket.id, socket.data.userId) ;


        socket.on("draw", (data) => {
            

            socket.to(socket.data.roomcode).emit("draw", {x:data.x, y:data.y}) ;            

        })

        socket.on("undraw", async(invitecode) => {
            const userId = socketToid.get(socket.id) ;
            // const room = idTorooms.get(userId) ;
            const room = await redis.get(`user:${userId}:room`) ;
           
            if(! room) return ;
            socket.to(room).emit("undraw") ;
        })
        
        socket.on("disconnect", (reason) => {
            console.log("User disconnected because", reason) ;
            const userId = socketToid.get(socket.id) ;
            socketToid.delete(socket.id) ;
            idTosocket.delete(userId) ;


        }) ;

        socket.on("create-board", async () => {
            const code = generateCode() ;

            socket.join(code) ;

            // rooms.set(code, {
            //     owner: socket.data.userId,
            //     collaborators : new Set([socket.data.userId]) 
            // })

            await redis.hSet(`room:${code}`, {
                owner: socket.data.userId
            })
            await redis.sAdd(`room:${code}:collaborators`, socket.data.userId) ;
            socket.data.roomcode = code ;
            // console.log(rooms) ;
            

            socket.emit("board-created", code) ;
        })


        socket.on("request-join", async(code: string) => {
            code = code.toUpperCase() ;
            // console.log(code) ;
            // console.log(boards) ;

            
            // const room = rooms.get(code) ;
            const owner = await redis.hGet(`room:${code}`, "owner") ;
            if(! owner ) {
                socket.emit("No Room exists") ;
                return ;
            }
            

            io.to(idTosocket.get(owner)).emit("join-request", ({
                userID: socket.data.userId,
                roomCode: code 
            })) ;


        })

        socket.on("accept-request",async({userId, roomCode}) => {
          
            // const room = rooms.get(roomCode) ;
            await redis.sAdd(`room:${roomCode}:collaborators`, userId) ;
            // room?.collaborators.add(userId) ;
          
            const socketid = idTosocket.get(userId) ;
            const usersocket = io.sockets.sockets.get(socketid) ;
       
            if(! usersocket) return ;
            usersocket.data.roomcode = roomCode ;
            usersocket?.join(roomCode) ;
            
            // idTorooms.set(userId, roomCode) ;
            await redis.set(`user:${userId}:room`, roomCode) ;
            io.to(socketid).emit("joined-room", roomCode) ;

        })

        socket.on("reject-request", ({userId, roomCode}: {userId: string, roomCode: string}) => {
            // console.log(userId) ;
            const socketid = idTosocket.get(userId) ;
            io.to(socketid).emit("not-joined-room",roomCode) ;
        }) ;

        socket.on("leave-room", async() => {
            const userId = socketToid.get(socket.id) ;
          
            const roomcode = await redis.get(`user:${userId}:room`) ;
            
            
            if(! roomcode) return ;

            // const room = rooms.get(roomcode) ;
            socket.leave(roomcode) ;
            // room?.collaborators.delete(userId) ;
            // idTorooms.delete(userId) ;
            await redis.del(`user:${userId}:room`) ;
            idTosocket.delete(userId) ;
            socketToid.delete(socket.id) ;
            socket.data.roomcode = undefined ;

            
            

        })



    })
}