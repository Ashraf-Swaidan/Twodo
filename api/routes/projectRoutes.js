import express from 'express';
import Project from '../models/Project.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import Invitation from '../models/Invitation.js';

const router = express.Router();

// Helper function to check if the user is a collaborator or owner
const checkProjectPermission = async (projectId, userId) => {
  const project = await Project.findOne({
    _id: projectId,
    $or: [
      { owner: userId }, // The owner of the project
      { 'collaborators.user': userId } // Collaborator
    ]
  });
  return project;
};

// Create Project
router.post('/', verifyToken, async (req, res) => {
  try {
    const project = new Project({
      ...req.body,
      owner: req.userId, // Associate the project with the authenticated user as owner
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Projects for the authenticated user (including collaborations)
router.get('/', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [
        { owner: req.userId }, // Owner projects
        { 'collaborators.user': req.userId } // Collaborator projects
      ]
    }).populate('todos');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Project by ID (for owner or collaborators)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const project = await checkProjectPermission(req.params.id, req.userId);
    if (!project) return res.status(404).json({ message: 'Project not found or access denied' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Project (only for owner or editor collaborators)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const project = await checkProjectPermission(req.params.id, req.userId);

    if (!project) return res.status(404).json({ message: 'Project not found or access denied' });

    // Only owner and collaborators with 'editor' role can update
    const isEditor = project.owner.toString() === req.userId || 
      project.collaborators.some(collab => collab.user.toString() === req.userId && collab.role === 'editor');
    
    if (!isEditor) return res.status(403).json({ message: 'You do not have permission to edit this project' });

    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Project (only owner)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.userId // Only the owner can delete the project
    });

    if (!project) return res.status(404).json({ message: 'Project not found or access denied' });
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add Collaborator
router.post('/:id/collaborators', verifyToken, async (req, res) => {
  try {
    const { userId, role } = req.body;

    const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found or access denied' });

    // Add collaborator if they are not already in the list
    if (!project.collaborators.some(collab => collab.user.toString() === userId)) {
      project.collaborators.push({ user: userId, role });
      await project.save();
      res.status(201).json({ message: 'Collaborator added' });
    } else {
      res.status(400).json({ message: 'User is already a collaborator' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove Collaborator
router.delete('/:id/collaborators/:collabId', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found or access denied' });

    project.collaborators = project.collaborators.filter(
      (collab) => collab.user.toString() !== req.params.collabId
    );
    await project.save();
    res.json({ message: 'Collaborator removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Collaborator Role
router.put('/:id/collaborators/:collabId', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
    if (!project) return res.status(404).json({ message: 'Project not found or access denied' });

    const collaborator = project.collaborators.find(collab => collab.user.toString() === req.params.collabId);
    if (collaborator) {
      collaborator.role = req.body.role; // Update role
      await project.save();
      res.json({ message: 'Collaborator role updated' });
    } else {
      res.status(404).json({ message: 'Collaborator not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send Invitation
router.post('/:id/invite', verifyToken, async (req, res) => {
  try {
    const { email } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to invite collaborators' });
    }

    // Check if an invitation already exists
    const existingInvite = await Invitation.findOne({ email, project: req.params.id });
    if (existingInvite) {
      if (existingInvite.status === 'rejected') {
        // Update the invitation status to pending if it was previously rejected
        existingInvite.status = 'pending'; // Reset status to pending
        existingInvite.rejectedAt = null; // Clear the rejection timestamp if needed
        await existingInvite.save(); // Save the updated invitation

        return res.status(200).json({ 
          message: 'Invitation previously rejected. Resending the invitation.', 
          invitation: existingInvite 
        });
      }
      return res.status(400).json({ message: 'Invitation already sent' });
    }

    // Create the invitation
    const invitation = new Invitation({
      email,
      project: req.params.id,
      invitedBy: req.userId,
    });
    await invitation.save();
  
    res.status(201).json({ message: 'Invitation sent', invitation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;
