import { redis } from "../Config/redisConfig.js"
import Strokes from "../Models/Strokes.js";

export const processRoom = async(roomCode: string) => {
    console.log("inside the job") ;
    const key = await redis.exists(`room:${roomCode}:strokes`) ;

    if(! key) return ;

    await redis.rename(`room:${roomCode}:strokes`, `room:${roomCode}:pending`) ;
    const strokes = await redis.lRange(`room:${roomCode}:pending`, 0, -1) ;

    const parsedStrokes = strokes.map(s => JSON.parse(s)) ;
    // console.log(parsedStrokes) ;
    await Strokes.insertMany(parsedStrokes) ;
    
    await redis.del(`room:${roomCode}:pending`) ;

}