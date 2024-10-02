import express from 'express';
import Project from '../models/Project.js'; // Update the import
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Project
router.post('/', verifyToken, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      user: req.userId, // Associate the project with the authenticated user
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Projects for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.userId }).populate('todos'); // Filter projects by user
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Project by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, user: req.userId }).populate('todos'); // Ensure the user owns the project
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Project
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // Ensure the user owns the project
      req.body,
      { new: true }
    );
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Project
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.id, user: req.userId }); // Ensure the user owns the project
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
