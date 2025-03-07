import mongoose,{Schema,model} from "mongoose";

const userSchema = new Schema({
        username :{
                type:String,
                required:true,
                min :[1,"Username must have atleast 1 character"],
                max :[100 ,"Username should not exceed more than 100 character"],
                unique:true,
                trim:true
        },
        email:{
                type:String,
                required :true,
                unique:true,
                trim:true,
                lowercase:true
        },
          password:{
                type:String,
                required :true,
                trim:true
        },
        role :{
                type:String,
                enum :['user','admin'] ,// only allow user or admin role
                default :'user'
        }
},{timestamps:true});

const User = model('User',userSchema);

export default User;