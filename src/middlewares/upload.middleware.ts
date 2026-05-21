import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

export const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});
