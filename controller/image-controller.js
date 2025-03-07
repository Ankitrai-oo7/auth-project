import { uploadToCloudinary } from "../helper/cloudinaryHelper.js";
import Image from "../model/image.js";
import cloudinary from "../config/cloudinary.js";
import path from "path";
import fs from "fs";
import { userInfo } from "os";



const uploadImage = async(req,res)=>{

  try{
        //console.log("controller")
        // check if file is missing in req objec
        if(!req.file){
                return res.status(400).json({
                        success:false,
                        message:"File is required.Please upload an image."
                })
        }
       
        // upload the file to cloudinary
       
        const { url, publicId } = await uploadToCloudinary(req.file.path);
          //console.log(url)
        // upload the image url and public Id along with uploaded user id in db
        const newlyUpdated = new Image({
                url,
                publicId,
                uploadedBy:req.userInfo.userId
        });
        await newlyUpdated.save();
       // delete the file from local storage
        fs.unlinkSync(req.file.path)

        res.status(201).json({
                success: true,
                message:"Image successfully uploaded",
                image:newlyUpdated
        });
          
  }catch(e){
       
        console.log(e);
        res.status(500).json({
                success:false,
                message:"Something went wrong"
        })
  }
        
}

const fetchImageController = async (req,res)=>{
        try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 2;
                const skip = (page-1)*limit;
                const sortBy = req.query.sortBy || 'createdAt';
                const sortOrder = req.query.sortOrder === 'asc' ? 1 :-1;
                const totalImages= await Image.countDocuments();
                const totalPages = Math.ceil(totalImages/limit);

                const sortObject = {};
                sortObject[sortBy] = sortOrder;

             const images = await Image.find().sort(sortObject).skip(skip).limit(limit);
             if(images){
                res.status(200).json({
                        success:true,
                        curentPage :page,
                        totalPages:totalPages,
                        totalImages:totalImages,
                        data :images,
                })
             }    
        } catch (error) {
              console.log(error);
              res.status(500).json({
                success:false,
                message :"Something went wrong.Please try again!"
              })  
        }
}

const deleteImageController = async (req,res)=>{
        try {
                const getCurrentIdOfImageToBeDeleted = req.params.id;
                const userId = req.userInfo.userId;
                const image = await Image.findById(getCurrentIdOfImageToBeDeleted);
                if(!image){
                      return  res.status(404).json({
                                success:false,
                                message:"Image not found"
                        })       
                }
            // check if this image is uploaded by current user who is trying to delete this image
            if(image.uploadedBy.toString()!=userId){
               return res.status(403).json({
                        success:false,
                        message:"You are not authorized to delete this image bcz you haven't uploadd this"
                }) 
            }  
            // delete this image first from the cloudinary storage
            await cloudinary.uploader.destroy(image.publicId);

            // delete this image from mongodb database

            await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted);

            res.status(200).json({
                success:true,
                message : "Image deleted successfully",

            })

        } catch (error) {
                console.log(error);
                res.status(500).json({
                        success:false,
                        message:"Something went wrong"
                })  
        }
}

export  {uploadImage,fetchImageController,deleteImageController};