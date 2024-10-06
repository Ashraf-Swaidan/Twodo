import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import User from '../models/User.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();
const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure 'uploads/' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Appends the file extension to the filename
  },
});

// Initialize multer upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limit file size to 5MB
});

// Register User
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

router.post('/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.resolve('uploads', path.basename(user.avatar));
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }

    // Save new avatar path
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Avatar uploaded successfully', avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;
