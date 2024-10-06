// invitationRoutes.js
import express from 'express';
import Invitation from '../models/Invitation.js';
import Project from '../models/Project.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Accept Invitation
router.post('/accept/:invitationId', verifyToken, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.invitationId).populate('project invitedBy');
    
    if (!invitation || invitation.status !== 'pending') {
      return res.status(404).json({ message: 'Invalid or expired invitation' });
    }

    // Ensure the project object is valid
    const project = invitation.project;
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if collaborators array exists
    if (!Array.isArray(project.collaborators)) {
      project.collaborators = []; // Initialize if undefined
    }

    // Update the collaborators in the project
    project.collaborators.push({ user: req.userId, role: 'viewer' });

    // Save the updated project
    await Project.findByIdAndUpdate(project._id, { collaborators: project.collaborators }, { new: true });

    // Mark the invitation as accepted
    invitation.status = 'accepted';
    await invitation.save();

    res.json({ message: 'Invitation accepted', project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reject Invitation
router.post('/reject/:invitationId', verifyToken, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.invitationId);
    if (!invitation || invitation.status !== 'pending') {
      return res.status(404).json({ message: 'Invalid or expired invitation' });
    }

    invitation.status = 'rejected';
    await invitation.save();

    res.json({ message: 'Invitation rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Invitations Sent TO the User
router.get('/to', verifyToken, async (req, res) => {
  try {
    const invitations = await Invitation.find({ email: req.email, status: 'pending' }).populate('project invitedBy');
    res.json(invitations);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Invitations Sent BY the User
router.get('/by', verifyToken, async (req, res) => {
  try {
    const invitations = await Invitation.find({ invitedBy: req.userId }).populate('project');
    res.json(invitations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
