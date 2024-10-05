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
    
    // Find the project by its ID
    const project = await Project.findById(projectId)
      .populate('todos'); // Populate the todos field if necessary

    // Check if the user is the owner or a collaborator
    if (!project || (project.owner.toString() !== req.userId && !project.collaborators.some(collab => collab.user.toString() === req.userId))) {
      return res.status(403).json({ message: 'Access denied. You are neither the owner nor a collaborator.' });
    }

    // Find todos that belong to the specified project
    const todos = await Todo.find({ 
      project: projectId // Only return todos that belong to the specified project
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
    // First, find the existing Todo to check its current project
    const existingTodo = await Todo.findOne({ _id: req.params.id, user: req.userId }); // Ensure the user owns the todo
    if (!existingTodo) return res.status(404).json({ message: 'Todo not found' });

    // Get the current project ID from the existing Todo
    const currentProject = existingTodo.project;

    // Update the Todo with the new data
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.userId }, // Ensure the user owns the todo
      req.body,
      { new: true }
    );

    if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });

    // Check if the project has changed
    if (req.body.project) {
      // If a new project is provided, add this Todo to the new project
      await Project.findByIdAndUpdate(req.body.project, { $addToSet: { todos: updatedTodo._id } });

      // If the current project is different, remove the Todo from the old project
      if (currentProject && currentProject.toString() !== req.body.project) {
        await Project.findByIdAndUpdate(currentProject, { $pull: { todos: updatedTodo._id } });
      }
    } else {
      // If no project is provided, just remove the Todo from the current project if it exists
      if (currentProject) {
        await Project.findByIdAndUpdate(currentProject, { $pull: { todos: updatedTodo._id } });
      }
    }

    res.json(updatedTodo);
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
