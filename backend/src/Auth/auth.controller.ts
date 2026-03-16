import type { Request, Response } from "express";
import bcrypt from "bcrypt" 
import authRepo from "./auth.repo.js";
import jwt from "jsonwebtoken"
import type{ CustomRequest } from "../Middleware/authMiddleware.js";
const signup = async(req: Request, res: Response) => {

    try {

        console.log(req) ;
        console.log(req.body) ;
        const {name, email, password} = req.body ;
        const hashed = await bcrypt.hash(password, 10) ;


        const credentials = {name, email, password: hashed}  ;
        console.log(credentials) ;


        const response = await authRepo.createuser(credentials) ;

        res.status(200).json({
            message: "Successfully Signed Up", 
            data: response
        })


    } catch(err) {
        res.status(500).json({
            message: "Internal Server Error" 
        })
    }



}



const signin = async(req: Request, res: Response) => {
    try {
        const {email, password} = req.body; 




        const response = await authRepo.signin(email ) ;

       if(! response) {
        return res.status(400).json({
            message: "Invalid credentials"  
        })
       }
       const dbpassword = response.password ;

       const compare = bcrypt.compare(dbpassword, password) ;
       if(! compare) {
        return res.status(400).json({
            message: "Invalid credentials" 
        })
       }

       const signature = {
        email: email, 
        id: response._id 
       }
       const token = jwt.sign(signature, process.env.JWT_SECRET as string) ;  


       res.cookie("token", token, {
        httpOnly:true, 
        secure: false
       });

       res.status(200).json({
            message: "Successfully Authorized" ,
            data: response
       })


       
    } catch(err) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }

}

const userInfo = async (req: CustomRequest, res: Response): Promise<void> => {
    try {

        const userindb = await authRepo.signin(req.user?.email || "") ;
        // console.log({ userindb });
        if (!userindb) {
            res.status(400).json({
                message: "Invalid user"
            })
            return ;
        }
        res.status(200).json({
            message: "User exists",
            user: {
                _id: userindb._id
            }
        })

        return ;


    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        })
    }



}
export default {
    signup,
    signin,
    userInfo
}