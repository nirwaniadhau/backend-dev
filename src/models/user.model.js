import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index:true, //to make it searchable
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,

    },
    fullname:{
        type: String,
        required: true,
        trim: true,
        index:true, //to make it searchable
    },
    avatar:{
        required: true,//cloudinary url
        type: String,
   
    },
    coverImage:{
        type: String,//cloudinary url
    },
    watchHistory:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
    }],
    password:{
        required: [true,"Password is required"],
        type:String 
    },
     refreshToken: {
            type: String
        }

    

}
,{timestamps:true}

)

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();
     this.password=await bcrypt.hash(this.password,10);
    
    next();
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=function(){
  return   jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY }
);
}
userSchema.methods.generateRefreshToken=function(){
     return   jwt.sign({
        _id:this._id,  
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn:process.env.REFRESH_TOKEN_EXPIRY }
);
}
export const User= mongoose.model("User", userSchema);