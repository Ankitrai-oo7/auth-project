import e from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
const router = e.Router();
router.get('/welcome',authMiddleware,(req,res)=>{

        const {username,userId,role} = req.userInfo;
          res.json({
                message :"Welcome to home",
                user:{
                        _id :userId,
                        username : username,
                        role,
                }
          })
});

export default router;