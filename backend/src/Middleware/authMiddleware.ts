import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"

export interface CustomRequest extends Request {
  user ? : {
    email: string,
    id : string
  }
}

export const authMiddleware = async(req: CustomRequest, res:Response, next: NextFunction) => {
    try {

        const token = req.cookies.token;




        if(! token) {
            res.status(401).json("You are not authorized.") ;
            return ;
        }

        const userdata: any = jwt.verify(token, process.env.JWT_SECRET as string) ;
        // console.log(userdata) ;

        

        req.user = userdata;
        if(! userdata.id ) {
            res.status(401).json("You are not authorized.") ;
            return ;
        }
        
        next() ;
        
    } catch(err) {
        res.status(500).json({
            message: "Internal server error" 
        })
    }



}