import e from 'express';
import { authMiddleware } from '../middleware/auth-middleware.js';
import { adminMiddleware } from '../middleware/admin-middleware.js';
const router = e.Router();

router.get('/page' , authMiddleware,adminMiddleware,(req,res)=>{
        
        
        res.json({
                message :"Welcome to Admin"
        });
   
       
   
})

export default router;