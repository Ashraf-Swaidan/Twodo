import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import todoRoutes from './routes/todoRoutes.js';
import listRoutes from './routes/listRoutes.js';
import authRoutes from './routes/authRoutes.js';
import path from 'path';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/todos', todoRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static('uploads'));


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
