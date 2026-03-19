import { createClient } from "redis";



export const redis = createClient({
    url: "redis://localhost:6379"
}) ;

redis.on("connect", () => {
  console.log("Redis connecting...");
});

redis.on("ready", () => {
  console.log("Redis ready");
});
 
redis.on("error", (err) => {
  console.error("Redis error:", err);
});

redis.on("end", () => {
  console.log("Redis disconnected");
});

export const connectRedis = async () => {
    await redis.connect() ;
}
