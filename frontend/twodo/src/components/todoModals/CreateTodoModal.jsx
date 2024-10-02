import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, TextField, CircularProgress } from '@mui/material';
import { DatePicker } from '@nextui-org/react';
import './CreateTodoModal.css'; // Import your CSS file

const CreateTodoModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(null);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Check if the window size is small on mount and resize
  const checkScreenSize = () => {
    setIsFullScreen(window.innerWidth < 600); // Adjust this threshold as needed
  };

  useEffect(() => {
    checkScreenSize(); // Check screen size on component mount
    window.addEventListener('resize', checkScreenSize); // Add resize listener

    return () => {
      window.removeEventListener('resize', checkScreenSize); // Cleanup listener on unmount
    };
  }, []);

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);

    // Extract tags from the title and update the tags state
    const newTags = value.match(/@(\w+)/g)?.map(tag => tag.substring(1)) || [];
    setTags(newTags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the title is not empty before submission
    if (title.trim() === '') {
      alert('Title is required.');
      return;
    }

    setLoading(true); // Set loading state

    // Convert the dueDate object to a valid date string (if it exists)
    const formattedDueDate = dueDate ? new Date(dueDate.year, dueDate.month - 1, dueDate.day).toISOString() : null;

    // Remove tags from the title for submission
    const cleanedTitle = title.replace(/@(\w+)/g, '').trim();

    const todoData = {
      title: cleanedTitle, // Use the cleaned title
      description,
      dueDate: formattedDueDate,
      tags,
    };

    try {
      await onCreate(todoData);
      resetFields();
      onClose(); // Close the dialog after creation
    } catch (error) {
      console.error("Error creating todo:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const resetFields = () => {
    setTitle('');
    setDescription('');
    setDueDate(null);
    setTags([]);
  };

  const handleCancel = () => {
    resetFields(); // Reset fields on cancel
    onClose(); // Close the dialog
  };

  return (
    <Dialog
      open={isOpen}
      onClose={handleCancel} // Use handleCancel to reset values on close
      aria-labelledby="create-todo-dialog"
      fullWidth
      maxWidth="sm"
      fullScreen={isFullScreen} // Set fullScreen based on window size
    >
      <DialogContent sx={{ padding: 2 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Title; type @tag to tag your todo."
            value={title}
            onChange={handleTitleChange}
            variant="filled"
            fullWidth
            required // Ensures the title is required
            sx={{
              marginBottom: 0, // No margin between text fields
              '& .MuiFilledInput-root': {
                backgroundColor: 'transparent',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&.Mui-focused': {
                  backgroundColor: 'transparent',
                },
                '&:before, &:after': {
                  display: 'none',
                },
              },
            }}
          />
          <TextField
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="filled"
            fullWidth
            multiline
            rows={1}
            sx={{
              marginBottom: 2, // Small margin at the bottom
              '& .MuiFilledInput-root': {
                backgroundColor: 'transparent',
                border: 'none',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&.Mui-focused': {
                  backgroundColor: 'transparent',
                },
                '&:before, &:after': {
                  display: 'none',
                },
              },
            }}
          />

          <DatePicker
            className="max-w-[204px] mb-2" // Added margin bottom for separation
            onChange={setDueDate}
            value={dueDate}
            css={{ width: '100%' }}
          />

          <div className="flex items-center my-4 ml-1">
            <span className='text-md mr-2'>
              Tags:
            </span>
            {tags.map((tag, index) => (
              <span key={index} className="inline-block opacity-40 bg-gray-600 text-white rounded px-3 py-1 mr-2">
                {tag}
              </span>
            ))}
          </div>

          <DialogActions>
            <button 
              type="button" // Change to type="button" to prevent form submission
              onClick={handleCancel} 
              className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-200 focus:outline-none"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600 focus:outline-none"
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Creating...' : 'Create Todo'}
            </button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTodoModal;
