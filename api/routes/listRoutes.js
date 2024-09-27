import express from 'express';
import List from '../models/List.js';

const router = express.Router();

// Create List
router.post('/', async (req, res) => {
  try {
    const list = new List(req.body);
    await list.save();
    res.status(201).json(list);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Lists
router.get('/', async (req, res) => {
  try {
    const lists = await List.find().populate('todos');
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get List by ID
router.get('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id).populate('todos');
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update List
router.put('/:id', async (req, res) => {
  try {
    const list = await List.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json(list);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete List
router.delete('/:id', async (req, res) => {
  try {
    const list = await List.findByIdAndDelete(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    res.json({ message: 'List deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
