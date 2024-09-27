import express from 'express';
import List from '../models/List.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create List
router.post('/', verifyToken, async (req, res) => {
  try {
    const list = new List({
      ...req.body,
      user: req.userId, // Associate the list with the authenticated user
    });
    await list.save();
    res.status(201).json(list);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Lists for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const lists = await List.find({ user: req.userId }).populate('todos'); // Filter lists by user
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get List by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const list = await List.findOne({ _id: req.params.id, user: req.userId }).populate('todos'); // Ensure the user owns the list
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update List
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const list = await List.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // Ensure the user owns the list
      req.body,
      { new: true }
    );
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json(list);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete List
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const list = await List.findOneAndDelete({ _id: req.params.id, user: req.userId }); // Ensure the user owns the list
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json({ message: 'List deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
