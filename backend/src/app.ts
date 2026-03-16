import express from "express" 
import type {Request, Response, Application} from "express" 
import cors from "cors"
import authRoutes from "./Auth/auth.routes.js"
import cookieParser from "cookie-parser"
const app: Application = express() ;

app.use(express.json()) ;
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(cors({
    origin : ["http://localhost:5173"],
    credentials: true
}))


app.get("/", (req: Request, res: Response) => {
    res.send(
        "server is running" 
    )
})



app.use("/auth", authRoutes) ;



export default app