const sharp = require("sharp");
const cloudinary = require("../config/cloudinary");

exports.compressAndUpload = async (fileBuffer, context) => {
  const compressedImage = await sharp(fileBuffer)
    .resize({ width: 800 })          // resize (optional but good)
    .jpeg({ quality: 70 })           // compression
    .toBuffer();

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
  {
    folder: "batchbond/chat",
    resource_type: "image"
  },
  (err, result) => {
    if (err) {
      console.error("CLOUDINARY ERROR:", err);
      reject(err);
    } else {
      resolve(result.secure_url);
    }
  }
).end(compressedImage);


  });
};
