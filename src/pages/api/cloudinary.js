 const cloudinary = require('cloudinary').v2;
 const streamifier = require('streamifier');
 
 cloudinary.config({
  cloud_name: 'dyygrts22',
  api_key: '761868861479614',
  api_secret: 'aqV-VKdj0AxoSfibGBJLltUwzXU'
 });
 
 // Function to upload image buffer to Cloudinary
 const uploadImage = async (buffer) => {
   return new Promise((resolve, reject) => {
     const stream = cloudinary.uploader.upload_stream(
       { folder: 'uploads' }, // Change folder name if needed
       (error, result) => {
         if (error) {
           console.error("Cloudinary Upload Error:", error);
           reject(error);
         } else {
           resolve(result);
         }
       }
     );
     streamifier.createReadStream(buffer).pipe(stream);
   });
 };
 
 module.exports = uploadImage;
 