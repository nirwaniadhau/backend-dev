import {User} from '../models/user.model.js';
import asyncHandler from '../utils/AsyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {uploadOnCloudinary} from '../utils/Cloudinary.js';
import { upload } from '../middlewares/multer.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const registerUser= asyncHandler( async( req,res)=>{
    // get user details from the frontend
    // validation - not empty
    // check if user already exist 
    // check for images, check for avatar
    // upload them to cloudinary,avatar
    // create user object
    // create entry in DB
    // save the user 
    // remove the password and refresh token field in response
    // check for user creation
    // return res 

    
    //get user details from the frontend
    const {username,fullname,email,password}=req.body;
    console.log(req.body);
    console.log("email: ",email); 
    
    //validation
    if(
        [fullname,username,password,email].some((field)=>
        field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    //check if user already exists
    //we wil require the accrss to the database ( User)
    
    const existedUser= User.findOne({
        $or:[{username},{email}]
    })

    if(existedUser){
        throw new ApiError(409,"User with email or username already exist ")
    }

    // check for images, check for avatar
    console.log("req.files:",req.files);
    console.log("req.files?.avatar[0]?.path :",req.files?.avatar[0]?.path );

    const avatarLocalPath=req.files?.avatar[0]?.path;
    const coverImageLocalPath=req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required");
    }

    


    //upload them to cloudinary 
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    console.log("avatar",avatar);
    const  coverImage=await uploadOnCloudinary(coverImageLocalPath);
     
    if(!avatar){
        throw new ApiError(400,"avatar file is required");
    }

     // create user object

     const user =await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
     })

     const createdUser =await User.findById(user._id).select(
        "-password -refreshToken"
     )


     if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
     }


     return res.status(201).json(new ApiResponse(200,
        createdUser,"User successfully registered"
     ))


})

export {registerUser};