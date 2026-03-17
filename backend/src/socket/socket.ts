import {Server} from "socket.io"
import crypto from "crypto"


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

const idTosocket = new Map() ;
const socketToid = new Map() ;
const idTorooms = new Map<string, string> () ;

const rooms = new Map<string, Roomtype>() ;

export const initSocket = (io: Server) => {
    

    io.on("connection", (socket) => {
        
        console.log("User Connected",  socket.id) ;
        socket.data.userId = socket.handshake.auth.id ;
        const roompresent = idTorooms.get(socket.data.userId) ;
        console.log("room already present", roompresent) ;
        if(roompresent) {
            socket.emit("joined-room", (roompresent)) ;
            console.log("room already present is: ", roompresent) ;
            socket.join(roompresent) ;
            socket.data.roomcode = roompresent ; 
        }

        // console.log("✅",socket.handshake) ;
        idTosocket.set(socket.data.userId, socket.id) ;
        socketToid.set(socket.id, socket.data.userId) ;


        socket.on("draw", (data) => {
            // console.log("Listened the draw event") ;

            socket.to(socket.data.roomcode).emit("draw", {x:data.x, y:data.y}) ;            

        })

        socket.on("undraw", (invitecode) => {
            const userId = socketToid.get(socket.id) ;
            const room = idTorooms.get(userId) ;
            // console.log("Room : " ,room ) ;
            if(! room) return ;
            socket.to(room).emit("undraw") ;
        })
        
        socket.on("disconnect", (reason) => {
            console.log("User disconnected because", reason) ;
            const userId = socketToid.get(socket.id) ;
            socketToid.delete(socket.id) ;
            idTosocket.delete(userId) ;


        }) ;

        socket.on("create-board", () => {
            const code = generateCode() ;

            socket.join(code) ;

            rooms.set(code, {
                owner: socket.data.userId,
                collaborators : new Set([socket.data.userId]) 
            })

            socket.data.roomcode = code ;
            // console.log(rooms) ;
            

            socket.emit("board-created", code) ;
        })


        socket.on("request-join", (code: string) => {
            code = code.toUpperCase() ;
            // console.log(code) ;
            // console.log(boards) ;

            
            const room = rooms.get(code) ;
            if(! room ) {
                socket.emit("No Room exists") ;
                return ;
            }
            // console.log(room) ;
            // console.log("💕",socket.data.userId) ;

            io.to(idTosocket.get(room.owner)).emit("join-request", ({
                userID: socket.data.userId,
                roomCode: code 
            })) ;


        })

        socket.on("accept-request",({userId, roomCode}) => {
            // console.log("socket", socket.data)
            // console.log("userID: ",userId) ;
            // console.log("roomCode: ", roomCode) ;
            const room = rooms.get(roomCode) ;
            room?.collaborators.add(userId) ;
            // console.log(room) ;
            // console.log(userId) ;
            // console.log(roomCode) ;
            const socketid = idTosocket.get(userId) ;
            const usersocket = io.sockets.sockets.get(socketid) ;
            // console.log(usersocket) ;
            if(! usersocket) return ;
            usersocket.data.roomcode = roomCode ;
            usersocket?.join(roomCode) ;
            // console.log("inside the accept-request") ;
            idTorooms.set(userId, roomCode) ;
            io.to(socketid).emit("joined-room", roomCode) ;

        })

        socket.on("reject-request", ({userId, roomCode}: {userId: string, roomCode: string}) => {
            // console.log(userId) ;
            const socketid = idTosocket.get(userId) ;
            io.to(socketid).emit("not-joined-room",roomCode) ;
        }) ;

        socket.on("leave-room", () => {
            const userId = socketToid.get(socket.id) ;
            // console.log(userId) ;
            // console.log(idTorooms) ;
            const roomcode = idTorooms.get(userId) ;
            // console.log("Te roomcode is : ",roomcode) ;
            if(! roomcode) return ;
            const room = rooms.get(roomcode) ;
            socket.leave(roomcode) ;
            room?.collaborators.delete(userId) ;
            idTorooms.delete(userId) ;
            idTosocket.delete(userId) ;
            socketToid.delete(socket.id) ;
            socket.data.roomcode = undefined ;

            // console.log("leave room called") ;
            

        })



    })
}