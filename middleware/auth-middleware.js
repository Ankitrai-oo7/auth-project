import  jwt  from "jsonwebtoken";


 export const authMiddleware = (req,res,next)=>{

        const authHeader = req.headers['authorization'];
        
        const token = authHeader && authHeader.split(" ")[1];
        if(!token){
              return  res.status(401).json({
                success : false,
                message :"Token not found.Access denied .Please login again to continue"
              });
        }
        // decode the token
          try {
                const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY);
               // console.log(decoded);
               req.userInfo = decodedToken;
                next();
          } catch (error) {
               return res.status(401).json({
                        success : false,
                        message :"Access denied .Please login again to continue"
                      });
                
          }
      
 }