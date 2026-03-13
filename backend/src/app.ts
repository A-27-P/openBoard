import express from "express" 
import type {Request, Response, Application} from "express" 
import dotenv from 'dotenv'

dotenv.config() 
const app: Application = express() ;

const PORT = process.env.PORT 


app.get("/", (req: Request, res: Response) => {
    res.send(
        "server is running" 
    )
})

try {
    app.listen(PORT , ()=> {
        console.log(`server is listening on port ${PORT}`) ;
    })

} catch(err) {

    console.log("Error while starting the server ", err) ;


}

