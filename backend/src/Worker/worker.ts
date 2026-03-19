import {Worker} from "bullmq" 
import { bullredis } from "../Config/bullRedis.js";

const worker = new Worker("stokequeue", 
    async(job) => {

    console.log(job) ;
    // console.log(`\n Worker is doing the job : ${...job},   data: ${job.data} \n`) ;
           
    }, {
        connection: {
            host: "127.0.0.1" , 
            port : 6379
        }
    }
) ;


worker.on("completed", (job) => {
    console.log(`\n\n The ${job} is done \n\n`) ;
})


worker.on("failed", (job) => {
    console.log(`\n\n The ${job} is Failed \n\n`) ;
})

console.log("\n -------Worker is running---------- \n")
