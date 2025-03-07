

export const adminMiddleware = (req,res,next)=>{
        
        if(req.userInfo.role!=="admin"){
                return res.status(401).json({
                        message :"Access denied! Admin access required"
                })
        }
        next();
}