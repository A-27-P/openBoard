import { Router } from "express";
import controller from "./auth.controller.js"
import { authMiddleware } from "../Middleware/authMiddleware.js";

const router = Router() ;

router.post("/signup", controller.signup) ;
router.post("/signin", controller.signin) ;
router.get("/checkme", authMiddleware, controller.userInfo) ;

export default router ;