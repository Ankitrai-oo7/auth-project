import mongoose,{Schema,model} from "mongoose";
import User from "./user.js";

const imageSchema = new Schema({

        url:{
                type:String,
                required:true
        },
        publicId:{
                type:String,
                required:true
        },
        uploadedBy:{
                type:mongoose.Schema.Types.ObjectId,
                ref :User,
                required :true
        }

},{timestamps:true});

const Image = model('Image',imageSchema)

export default Image;