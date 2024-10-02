import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, TextField } from '@mui/material';
import { useProjectsContext } from '../../hooks/useProjects'; // Reuse the useProjects hook

const CreateProjectModal = ({ isOpen, onClose }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { addProject } = useProjectsContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addProject({ name: projectName, description });
      setProjectName('');
      setDescription('');
      onClose(); // Close the modal after successful creation
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            variant="filled"
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="filled"
            fullWidth
            multiline
            rows={3}
            sx={{ marginBottom: 2 }}
          />

          <DialogActions>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-1 text-gray-800 bg-gray-300 rounded hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-1 text-white bg-gray-500 rounded hover:bg-gray-600 focus:outline-none"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
