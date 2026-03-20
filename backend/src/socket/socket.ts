import {Server} from "socket.io"
import crypto from "crypto"
import { redis } from "../Config/redisConfig.js"
import { strokeQueue } from "../Config/queue.js"



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
// const rooms = new Map<string, Roomtype>() ;

const idTosocket = new Map() ;
const socketToid = new Map() ;
// const idTorooms = new Map<string, string> () ;


export const initSocket = (io: Server) => {
    

    io.on("connection", async(socket) => {
        
        console.log("User Connected",  socket.id) ;
        socket.data.userId = socket.handshake.auth.id ;
        // const roompresent = idTorooms.get(socket.data.userId) ;
        // const roompresent = await redis.get(`user:${socket.data.userId}:room`) ;
        // const owner = await redis.hGet(`room:${roompresent}`, "owner") ;
        // const owner_room = await redis.get(`user:${owner}:room`) ;
        // const allrooms = await redis.get(`user:${socket.data.userId}:room`) ;
        // console.log(`Rooms for the ${socket.data.userId} is : ${allrooms}`) ;
        // if(roompresent) {
        //     if(owner_room === roompresent) {

        //         socket.emit("joined-room", (roompresent)) ;
                
        //         socket.join(roompresent) ;
        //         socket.data.roomcode = roompresent ; 
        //     }
        //     else {
        //         await redis.del(`user:${socket.data.userId}:room`) ;
        //     }
        // }

       
        idTosocket.set(socket.data.userId, socket.id) ;
        socketToid.set(socket.id, socket.data.userId) ;


        socket.on("draw", (data) => {
            socket.emit("le bc",)

            socket.to(socket.data.roomcode).emit("draw", {x:data.x, y:data.y}) ;            

        })

        socket.on("undraw", async(invitecode, strokeData) => {
            const userId = socketToid.get(socket.id) ;
            // const room = idTorooms.get(userId) ;
            if(strokeData?.points?.length !== 0) {
                const room = await redis.get(`user:${userId}:room`) ;
                const order = await redis.incr(`room:${room}:counter`) ;
            strokeData = {
                ...strokeData, 
                order:order
            }
                await redis.rPush(`room:${room}:strokes`, JSON.stringify(strokeData)) ;
                await strokeQueue.add("flush-strokes", {
                    room: room, 

                
                }) ;
                

                
                if(! room) return ;
                socket.to(room).emit("undraw") ;
                
            }

        })
        
        socket.on("disconnect", async(reason) => {
            console.log(`User ${socket.data.userId} disconnected because`, reason) ;
            const userId = socketToid.get(socket.id) ;
            socketToid.delete(socket.id) ;
            idTosocket.delete(userId) ;
            await redis.del(`user:${userId}:room`) ;


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
            await redis.set(`user:${socket.data.userId}:room`, code) ;
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
            const strokes = await redis.lRange(`room:${roomCode}:strokes`, 0, -1) ;
            const parsedStrokes = strokes.map(s => JSON.parse(s)) ;
            io.to(socketid).emit("joined-room", roomCode, parsedStrokes) ;

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
            // idTosocket.delete(userId) ;
            // socketToid.delete(socket.id) ;
            socket.data.roomcode = undefined ;

            
            

        }) ;




    })
}