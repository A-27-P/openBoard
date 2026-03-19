import {Queue} from "bullmq" 


export const strokeQueue = new Queue("stokequeue", {
    connection: {
        host: "127.0.0.1", 
        port : 6379
    } ,
})

