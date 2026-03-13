import express from "express" 
import type {Request, Response, Application} from "express" 

const app: Application = express() ;


app.get("/", (req: Request, res: Response) => {
    res.send(
        "server is running" 
    )
})

export default app