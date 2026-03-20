import {Router } from "express"
import controller from "./board.controller.js"
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = Router() ;


router.post("/", authMiddleware ,controller.createBoard) ;



export default router ;