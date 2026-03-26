import {Worker} from "bullmq" 
import { processRoom } from "./Jobs.js";
import { connectRedis } from "../Config/redisConfig.js";
import connectDb from "../Config/mongoConfig.js";
import dotenv from "dotenv"

dotenv.config() ;
connectRedis() ;
connectDb() ;

const worker = new Worker("stokequeue", 
    async(job) => { 
        if(job.name === "flush-strokes") {
            
            processRoom(job.data.room)


        }
    }, {
        connection: {
            host: "127.0.0.1" , 
            port : 6379
        }
    }
) ;


worker.on("completed", (job) => {
    console.log(`\n\n The ${job.name} is done \n\n`) ;
})


worker.on("failed", (job) => {
    console.log(`\n\n The ${job?.name} is Failed \n\n`) ;
})

console.log("\n -------Worker is running---------- \n")