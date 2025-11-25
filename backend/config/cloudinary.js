import { v2 as clodinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (file) => {
  try {
    clodinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_SECRET_KEY,
    });
    const result = await clodinary.uploader.upload(file, {
      resource_type: "auto",
    });

    fs.unlinkSync(file);

    return result.secure_url;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(file);
  }
};

export default uploadOnCloudinary;
