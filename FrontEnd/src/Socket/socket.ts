import { io, Socket } from "socket.io-client"
import { useAuth } from "../AuthContext/authcontext";
import { useEffect, useRef } from "react";

export const useSocket = () => {

    const socketRef = useRef<Socket | null>(null)
    const auth = useAuth()
    
    useEffect(() => {
        // console.log("Before the auth check") ;
        // console.log(auth) ;
        // if (!auth || !auth._id) return
        console.log("After the auth check ", auth) ;

        socketRef.current = io("http://localhost:8000", {
            auth: {
                id: auth._id
            }
        })


        // socketRef.current.on("connect", () => {
        //     console.log("Socket connected:", socketRef.current?.id)
        // })



        return () => {
            socketRef.current?.disconnect()
        }

    }, [auth])

    return socketRef ;

}