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




const idTosocket = new Map() ;
const socketToid = new Map() ;
const rooms = new Map() ;

export const initSocket = (io: Server) => {
    

    io.on("connection", (socket) => {
        
        console.log("User Connected",  socket.id) ;
        socket.data.userId = socket.handshake.auth.id ;
        console.log("✅",socket.handshake) ;
        idTosocket.set(socket.data.userId, socket.id) ;
        idTosocket.set(socket.id, socket.data.userId) ;


        socket.on("draw", (data) => {
            // console.log("Listened the draw event") ;

            socket.to(data.invitecode).emit("draw", {x:data.x, y:data.y}) ;            

        })

        socket.on("undraw", (invitecode) => {
            socket.to(invitecode).emit("undraw") ;
        })
        
        socket.on("disconnect", (reason) => {
            console.log("User disconnected because", reason) ;
            

        }) ;

        socket.on("create-board", () => {
            const code = generateCode() ;

            socket.join(code) ;

            rooms.set(code, {
                owner: socket.data.userId,
            })

            socket.data.roomcode = code ;
            console.log(rooms) ;
            

            socket.emit("board-created", code) ;
        })


        socket.on("request-join", (code: string) => {
            code = code.toUpperCase() ;
            console.log(code) ;
            // console.log(boards) ;

            
            const room = rooms.get(code) ;
            if(! room ) {
                socket.emit("No Room exists") ;
                return ;
            }
            console.log(room) ;
            io.to(idTosocket.get(room.owner)).emit("join-request", {
                userId : socket.data.userId
            })


        })




    })
}