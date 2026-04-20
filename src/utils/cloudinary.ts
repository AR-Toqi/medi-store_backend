import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

// Basic check to ensure keys are loaded
if (!process.env.CLOUDINARY_API_KEY) {
  console.error("WARNING: Cloudinary API Key is missing. Image uploads will fail.");
}

export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Determine folder based on route or fieldname
    let folder = 'medistore';
    const url = req.originalUrl;
    if (file.fieldname === 'image') {
      if (url.includes('medicines')) {
        folder = 'medistore/medicines';
      } else if (url.includes('users') || url.includes('user') || url.includes('me')) {
        folder = 'medistore/users';
      } else if (url.includes('categories')) {
        folder = 'medistore/categories';
      }
    } else if (file.fieldname === 'logo') {
      folder = 'medistore/shops';
    }

    return {
      folder: folder,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
    };
  },
});

export const extractPublicId = (url: string): string | null => {
  if (!url) return null;
  // Regex to extract public_id from Cloudinary URL
  // It matches everything after 'upload/v<digits>/' or 'upload/' and before the file extension
  const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
  const match = url.match(regex);
  return (match && match[1]) ? match[1] : null;
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return;
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary Deletion Error:", error);
    // We don't throw here to avoid blocking DB cleanup if Cloudinary fails, 
    // but in a production app, you might want to log this to a monitoring service.
  }
};

export default cloudinary;
