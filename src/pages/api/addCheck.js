import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../DatabaseConfig/FirebaseConnect';
import uploadImage from './cloudinary'; // Import your Cloudinary upload function

const storage = multer.memoryStorage(); // Store files in memory instead of disk
const upload = multer({ storage });

export const config = {
  api: {
    bodyParser: false, 
  },
};

const multerMiddleware = upload.single('image');

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');  
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  try {
    await runMiddleware(req, res, multerMiddleware);

    const { title } = req.body;
    if (!title || !req.file) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Upload image to Cloudinary
    const cloudinaryResponse = await uploadImage(req.file.buffer);
    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      throw new Error('Cloudinary upload failed');
    }

    // Save image URL in Firebase
    const docRef = await addDoc(collection(db, 'zia'), {
      title,
      imageUrl: cloudinaryResponse.secure_url, // Store Cloudinary URL
      createdAt: new Date().toISOString(),
    });

    res.status(200).json({ success: true, id: docRef.id, imageUrl: cloudinaryResponse.secure_url });
  } catch (e) {
    console.error('Error processing request:', e);
    res.status(500).json({ success: false, message: 'Error processing request' });
  }
}
