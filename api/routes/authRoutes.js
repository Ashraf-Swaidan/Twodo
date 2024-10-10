import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { bucket } from './firebaseConfig.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();
const router = express.Router();

// Set multer to store files in memory temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload avatar route
router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Generate a unique filename
    const fileName = `${Date.now()}-${uuidv4()}${path.extname(req.file.originalname)}`;
    const file = bucket.file(fileName);

    // Create a write stream to upload the file to Firebase Storage
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // Handle errors during upload
    stream.on('error', (error) => {
      res.status(500).json({ message: error.message });
    });

    // When the upload finishes, update the user's avatar URL
    stream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

      // Optional: delete old avatar if necessary

      // Update user's avatar field in the database
      user.avatar = publicUrl;
      await user.save();

      res.json({ message: 'Avatar uploaded successfully', avatar: user.avatar });
    });

    // Upload the file buffer to Firebase
    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register User
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  
  try {
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email is already in use' });
    }

    // If username and email are unique, proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    
    // Save the user in the database
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Check availability of username or email
router.get('/check-availability', async (req, res) => {
  const { username, email } = req.query;
  
  try {
    // Check if username is taken
    if (username) {
      const existingUsername = await User.findOne({ username });
      if (existingUsername) {
        return res.status(200).json({ available: false, field: 'username', message: 'Username is already taken' });
      }
    }

    // Check if email is taken
    if (email) {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(200).json({ available: false, field: 'email', message: 'Email is already in use' });
      }
    }

    // If neither are taken, return available
    return res.status(200).json({ available: true, message: 'Available' });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      {
        id: user._id,           // User ID
        username: user.username, // User username
        email: user.email,      // User email
        avatar: user.avatar
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }        // Token expiration time
    );
    
    // Return token and user details
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar // Include avatar URL
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user (Protected route)
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({
        id: user._id,
        email: user.email,
        username: user.username,
        avatar: user.avatar // Include avatar URL
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch user details by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username email avatar'); // Only get username and email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;
