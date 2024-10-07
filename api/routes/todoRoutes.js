import express from 'express';
import Todo from '../models/Todo.js';
import Project from '../models/Project.js'; // Import Project model
import { verifyToken } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get the extension
    const fileName = `${Date.now()}-${file.originalname}`; // original fileName already includes extension
    cb(null, fileName);
    
  }
});

const upload = multer({ storage });

const isUserAuthorizedForTodo = async (projectId, userId) => {
  const project = await Project.findById(projectId).select('owner collaborators');
  if (!project) return false;

  const isOwner = project.owner.toString() === userId;
  const isEditor = project.collaborators.some(collab => collab.user.toString() === userId && collab.role === 'editor');

  return isOwner || isEditor;
};


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
    // Find the existing Todo and check if it belongs to the requesting user
    const existingTodo = await Todo.findOne({ _id: req.params.id });

    if (!existingTodo) return res.status(404).json({ message: 'Todo not found' });

    // If todo belongs to a project, verify permissions for project owner or editor
    if (existingTodo.project) {
      const isAuthorized = await isUserAuthorizedForTodo(existingTodo.project, req.userId);
      if (!isAuthorized) return res.status(403).json({ message: 'You are not authorized to update this todo' });
    } else {
      // If todo has no project, verify ownership
      if (existingTodo.user.toString() !== req.userId) return res.status(403).json({ message: 'You are not authorized to update this todo' });
    }

    // Proceed with updating the todo
    const currentProject = existingTodo.project;

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );

    if (!updatedTodo) return res.status(404).json({ message: 'Todo not found' });

    // Handle project association updates
    if (req.body.project) {
      await Project.findByIdAndUpdate(req.body.project, { $addToSet: { todos: updatedTodo._id } });

      if (currentProject && currentProject.toString() !== req.body.project) {
        await Project.findByIdAndUpdate(currentProject, { $pull: { todos: updatedTodo._id } });
      }
    } else if (currentProject) {
      await Project.findByIdAndUpdate(currentProject, { $pull: { todos: updatedTodo._id } });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Todo
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Find the todo by id
    const todo = await Todo.findOne({ _id: req.params.id });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    // Check permissions: Either the user is the owner of the todo or has project-level permissions
    if (todo.project) {
      const isAuthorized = await isUserAuthorizedForTodo(todo.project, req.userId);
      if (!isAuthorized) return res.status(403).json({ message: 'You are not authorized to delete this todo' });
    } else {
      // If todo has no project, check if user owns the todo
      if (todo.user.toString() !== req.userId) return res.status(403).json({ message: 'You are not authorized to delete this todo' });
    }

    // Delete the todo
    const deletedTodo = await Todo.findOneAndDelete({ _id: req.params.id });
    if (!deletedTodo) return res.status(404).json({ message: 'Todo not found' });

    // If the todo is linked to a project, remove it from the project's todo list
    if (deletedTodo.project) {
      await Project.findByIdAndUpdate(deletedTodo.project, { $pull: { todos: deletedTodo._id } });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add comment endpoint
router.post('/:id/comments', verifyToken, upload.array('attachments', 5), async (req, res) => {
  try {
    console.log(req.files); // Log to check
    const text = req.body.text; // Get the comment text
    const attachments = req.files?.map(file => ({
      fileUrl: file.path,
      fileName: file.originalname,
      mimetype: file.mimetype // Capture the file's MIME type
    })) || []; // Handle case with no files

    const todo = await Todo.findById(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    const newComment = {
      user: req.userId,
      text,
      attachments
    };

    todo.comments.push(newComment);
    await todo.save();

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get All Comments for a Todo
router.get('/:id/comments', verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    // If the todo belongs to a project, ensure the user is either the owner or an editor
    if (todo.project) {
      const isAuthorized = await isUserAuthorizedForTodo(todo.project, req.userId);
      if (!isAuthorized) return res.status(403).json({ message: 'You are not authorized to view comments for this todo' });
    } else {
      // If no project, ensure the user owns the todo
      if (todo.user.toString() !== req.userId) return res.status(403).json({ message: 'You are not authorized to view comments for this todo' });
    }

    res.json(todo.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a Comment from a Todo (with attachment file removal)
router.delete('/:todoId/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const { todoId, commentId } = req.params;

    // Find the Todo by ID
    const todo = await Todo.findById(todoId);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    // Check if the user is authorized to delete comments
    if (todo.project) {
      const isAuthorized = await isUserAuthorizedForTodo(todo.project, req.userId);
      if (!isAuthorized) return res.status(403).json({ message: 'You are not authorized to delete a comment from this todo' });
    } else {
      if (todo.user.toString() !== req.userId) return res.status(403).json({ message: 'You are not authorized to delete a comment from this todo' });
    }

    // Find the comment within the Todo's comments array
    const comment = todo.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if the comment belongs to the authenticated user
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this comment.' });
    }

    // Remove associated files if any
    if (comment.attachments && comment.attachments.length > 0) {
      comment.attachments.forEach(file => {
        const filePath = path.resolve('uploads', path.basename(file.fileUrl)); // Use path.basename to get the file name correctly
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);  // Delete the file
        }
      });
      
    }

    // Remove the comment from the array
    todo.comments.pull({ _id: commentId });

    // Save the Todo after removing the comment
    await todo.save();

    res.json({ message: 'Comment and its attachments deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Edit a Comment on a Todo
router.put('/:todoId/comments/:commentId', verifyToken, async (req, res) => {
  try {
    const { todoId, commentId } = req.params;
    const { text } = req.body;

    // Find the Todo by ID
    const todo = await Todo.findById(todoId);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });

    // Check if the user is authorized to edit comments
    if (todo.project) {
      const isAuthorized = await isUserAuthorizedForTodo(todo.project, req.userId);
      if (!isAuthorized) return res.status(403).json({ message: 'You are not authorized to edit a comment on this todo' });
    } else {
      // If no project, ensure the user owns the todo
      if (todo.user.toString() !== req.userId) return res.status(403).json({ message: 'You are not authorized to edit a comment on this todo' });
    }

    // Find the comment within the Todo's comments array
    const comment = todo.comments.id(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    // Check if the comment belongs to the authenticated user
    if (comment.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'You are not authorized to edit this comment.' });
    }

    // Update the comment text
    comment.text = text;

    // Save the Todo after updating the comment
    await todo.save();

    res.json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
