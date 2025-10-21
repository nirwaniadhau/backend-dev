import { User } from "../models/user.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { upload } from "../middlewares/multer.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import path from "path";

const generateAccessandRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    console.log(refreshToken)
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and  access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
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
  const { username, fullname, email, password } = req.body;
  console.log(req.body);
  console.log("email: ", email);

  //validation
  if (
    [fullname, username, password, email].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //check if user already exists
  //we wil require the accrss to the database ( User)

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exist ");
  }

  // check for images, check for avatar
  console.log("req.files:", req.files);
  console.log("req.files?.avatar[0]?.path :", req.files?.avatar[0]?.path);

  // const avatarLocalPath=req.files?.avatar[0]?.path;
  // const coverImageLocalPath=req.files?.coverImage[0]?.path;

  const avatarLocalPath = req.files?.avatar[0]?.path.replace(/\\/g, "/");
  const coverImageLocalPath = req.files?.coverImage[0]?.path.replace(
    /\\/g,
    "/"
  );

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }

  //upload them to cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  console.log("avatar", avatar);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  console.log("coverImage:", coverImage);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  // create user object

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User successfully registered"));
});

const loginUser = asyncHandler(async (req, res) => {
  //1. get the credentials from the user ( frontend) -- email/username , password
  //check if the email exist in the databse
  //check if the password is correct
  // generate the referesh and access tokens
  //send cookies
  //send response
  // if everything correct go to the dashboard

  const { username, email, password } = req.body;
  console.log(req.body);
  if ((!username || !email) ){
    throw new ApiError(400, "username or email is required");
  }

  const existedUser = await User.findOne({
    //this is to find the uer based on either username or the email
    $or: [{ username }, { email }],
  });

  if (!existedUser) {
    throw new ApiError(
      404,
      "User does not exist in the databse register first!"
    );
  }

  //mongoose ke jo mehtds hai nlike the findone and all they are accessible only the User ( mongoose object)
  //the method we have written in the model file should be accessed by the user from th database
  const isPasswordMatch = await existedUser.isPasswordCorrect(password);

  if (!isPasswordMatch) {
    throw new ApiError(400, "Wrong credentials please retry the login ");
  }

  const { refreshToken, accessToken } = await generateAccessandRefreshTokens(
    existedUser._id
  );

  const loggedInUser = await User.findById(existedUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //find the user but how?
  //middleware ( jane se pehle milke jayega)
  //
  //clear cookies

  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },

    {
      new: true,
    }

  );

   const options = {
    httpOnly: true,
    secure: true,
  };

  return res.
  status(200)
  .clearCookie("accessToken",options)
  .json(new ApiResponse(200,{},"User LOGGED OUT SUCCESSFULLY"))
});

export { registerUser, loginUser, logoutUser };
    