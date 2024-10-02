import express from 'express';
import Todo from '../models/Todo.js';
import Project from '../models/Project.js'; // Import Project model
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Todo in todoRoutes
router.post('/', verifyToken, async (req, res) => {
  try {
    const { project, ...todoData } = req.body; // Destructure to get project ID
    const todo = new Todo({
      ...todoData,
      user: req.userId, // Associate the todo with the authenticated user
      project: project || null, // Set project ID if provided
    });
    await todo.save();

    if (project) {
      await Project.findByIdAndUpdate(project, { $push: { todos: todo._id } });
    }

    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Todos for the authenticated user
router.get('/', verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.userId }); // Filter todos by user
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Todos by Project ID
router.get('/project/:projectId', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;

    // Find todos that either belong to the specified project or have no project field
    const todos = await Todo.find({ 
      user: req.userId, 
      $or: [
        { project: projectId }, // Todos that belong to the specified project
        { project: { $exists: false } } // Todos that do not have a project field
      ]
    });

    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get Todo by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.userId }); // Ensure the user owns the todo
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Todo
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // Ensure the user owns the todo
      req.body,
      { new: true }
    );
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Todo
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.userId }); // Ensure the user owns the todo
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    if (todo.project) {
      await Project.findByIdAndUpdate(todo.project, { $pull: { todos: todo._id } });
    }
    
    res.json({ message: 'Todo deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
