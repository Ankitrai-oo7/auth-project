import User from "../model/user.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";


// to register new user 
const registerUser =async(req,res)=>{
   try {
        const {username,email,password,role} = req.body;
        //check if user is already exist in database or not
const checkExistingUser = await User.findOne({$or :[{username},{email}]});
  if(checkExistingUser){
        return res.status(400).json({
                success:false,
                message:
                "User already exist with this username  or email in db.Please try with a different username or email "
        });
        }
  //hash the password
       const salt = await bcrypt.genSalt(10);
       const hashPassword = await bcrypt.hash(password,salt);

       // create a new user and save in database

       const newlyCreatedUser = new User({
             username,
             email,
             password:hashPassword,
             role: role || 'user'
             });
             await newlyCreatedUser.save();
       if(newlyCreatedUser){
        res.status(201).json({
                success:true,
                message:"User created successfully",
                data:newlyCreatedUser
        })
       }else{
        res.status(400).json({
                success:false,
                message:"Unable to register please try again after sometime"
        })
       }
        
   } catch (error) {
        console.log(error);
        res.status(500).json({
                success:false,
                message:'something went wrong'
        })
   }
}

// user login controller

const userLogin = async(req,res)=>{
        try {
            const {username,password} =req.body;
            // check if user is present in db or not
            const user = await User.findOne({username});
            if(!user){
                return res.status(400).json({
                        success:false,
                        message:`User doesn't exists`
                })
            }    
            // to check if password is correct or not
            const isPasswordMatch = await bcrypt.compare(password,user.password);
            if(!isPasswordMatch){
                return res.status(400).json({
                        success:false,
                        message:"Password is incorrect"
                })
            }
            // create token
            const accessToken = jwt.sign({
                userId :user._id,
                username : user.username,
                role:user.role
            },process.env.JWT_SECRET_KEY,{
                expiresIn:"15m"
            });
            res.status(200).json({
                success:true,
                message:"loggedIn",
                accessToken
            })

        } catch (error) {
                console.log(error);
                res.status(500).json({
                        success:false,
                        message:"Something went wrong"
                })
        }
}


const changePassword = async (req,res)=>{
        try {
                const userId =  req.userInfo.userId;
                // extract old and new password
                const {oldPassword,newPassword} = req.body;
                // find the current logdin user
                const user = await User.findById(userId);
                if(!user){
                        return res.status.json({
                                success :false,
                                message : "User not found"
                        });
                }
         // check if old password is correct
         
         const isPasswordMatch = await bcrypt.compare(oldPassword,user.password);
         if(!isPasswordMatch){
                return res.status(400).json({
                        success:false,
                        message :"Old Password in not correct"
                })
         }
         // hash the password
                const salt = await bcrypt.genSalt(10);
                const newHashPassword = await bcrypt.hash(newPassword,salt);
          // update the password
          user.password = newHashPassword;
          await user.save();

          res.status(200).json({
                success:true,
                message:"Password chenge successfully"
          })
        } catch (error) {
                console.log(error);
                res.status(500).json({
                        success:false,
                        message:"Something went wrong"
                })
        }
}

export {registerUser,userLogin,changePassword}