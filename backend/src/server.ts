import app from "./app.js"
import http from "http" 
import dotenv from 'dotenv'
import {Server} from "socket.io"
import { initSocket } from "./socket/socket.js"


dotenv.config() 

const PORT = process.env.PORT 

const server = http.createServer(app) ;

const io = new Server(server, {
    cors: {
        origin : "*"
    }
})

initSocket(io) ; 



server.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}` )
})

