import type { Request, Response } from "express";
import boardRepo from "./board.repo.js";
import type { CustomRequest } from "../Middleware/authMiddleware.js";

const createBoard = async(req: CustomRequest, res: Response) => {
    try {

        const userId = req.user?.id ;
        
        const _id = await boardRepo.create(userId!) ;

        res.status(200).json({
            message: "Successfully created the board", 
            data : _id 
        }) ;

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error", 
            error : err
        })
    }
}

export default {
    createBoard
}