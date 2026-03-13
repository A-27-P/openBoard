import {Server} from "socket.io"

export const initSocket = (io: Server) => {
    

    io.on("connection", (socket) => {
        
        console.log("User Connected",  socket.id) ;

        socket.on("draw", (data) => {
            // console.log("Listened the draw event") ;

            socket.broadcast.emit("draw", data ) ;            

        })

        socket.on("undraw", () => {
            socket.broadcast.emit("undraw") ;
        })
        
        socket.on("disconnect", (reason) => {
            console.log("User disconnected because", reason) ;

        })
    })
}