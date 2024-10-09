import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import invitationRoutes from './routes/invitationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed origins (your frontend URL)
const allowedOrigins = [
  'https://twodo.vercel.app', // Your frontend domain
  // Add any other domains that you want to allow
];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // If you want to allow cookies or authentication credentials
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/todos', todoRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/projects', projectRoutes);
app.use('/api/invitations', invitationRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
