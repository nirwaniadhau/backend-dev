// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import { config } from "dotenv";

// config();

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const uploadOnCloudinary = async(localFilePath) => {
//     try{
//         if(!localFilePath){
//             return null
//         }
//        const response=await cloudinary.uploader.upload(localFilePath,{ resource_type: "auto" })
//         //file has been successfully uploaded on cloudinary

//         console.log("file uploaded on cloudinary",response.url);
//         return response;


        
//     }catch(error){
//         fs.unlinkSync(localFilePath) //removed the locally saved temp file as the upload operations got failed 

//         return null;
//     }
// }


// export { uploadOnCloudinary };

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Normalize Windows paths
    const normalizedPath = localFilePath.replace(/\\/g, '/');

    const response = await cloudinary.uploader.upload(normalizedPath, { resource_type: "auto" });

    console.log("file uploaded on cloudinary:", response.url);
    return response;

  } catch (error) {
    console.error("Cloudinary upload failed:", error.message);

    // Safely remove temp file
    try {
      fs.unlinkSync(localFilePath);
    } catch (err) {
      console.warn("Failed to remove temp file:", err.message);
    }

    return null;
  }
};

export { uploadOnCloudinary };
