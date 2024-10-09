import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import invitationRoutes from './routes/invitationRoutes.js';
import { verifyToken } from './middleware/authMiddleware.js'; // Import the middleware

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.options('*', cors()); // Handle preflight requests
app.use(express.json());
app.use('/api/todos', verifyToken, todoRoutes); // Protect this route
app.use('/api/auth', authRoutes); // No auth middleware here for login
app.use('/uploads', express.static('uploads'));
app.use('/api/projects', verifyToken, projectRoutes); // Protect this route
app.use('/api/invitations', verifyToken, invitationRoutes); // Protect this route

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
