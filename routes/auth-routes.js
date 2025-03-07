import e from "express";
import { registerUser,userLogin,changePassword } from "../controller/auth-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

const router = e.Router();


router.post('/register',registerUser);
router.post('/login',userLogin);
router.post('/change-password',authMiddleware,changePassword);

export default router;