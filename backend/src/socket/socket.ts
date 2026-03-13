import {Server} from "socket.io"

export const initSocket = (io: Server) => {
    

    io.on("connection", (socket) => {
        
        console.log("User Connected",  socket.id) ;

        socket.on("draw", (data) => {
            console.log("Listened the draw event") ;
            console.log(data) ;

            socket.send("ok, received the message", data) ;
        })
        

        socket.on("disconnect", () => {
            console.log("User disconnected") ;

        })




    })



}