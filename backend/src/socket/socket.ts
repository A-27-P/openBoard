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


const boards = new Map() ;

export const initSocket = (io: Server) => {
    

    io.on("connection", (socket) => {
        
        console.log("User Connected",  socket.id) ;

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

            boards.set(code, {
                owner : socket.id 
            })
            console.log(boards) ;

            socket.emit("board-created", code) ;
        })


        socket.on("join-request", (code: string) => {
            code = code.toUpperCase() ;
            console.log(code) ;
            console.log(boards) ;
            if(! boards.get(code)) {
                return ;
            }
            io.to(boards.get(code).owner).emit("join-request", socket.id) ;
            

        })




    })
}