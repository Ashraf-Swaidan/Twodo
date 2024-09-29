// src/components/todoModals/CreateTodoModal.js

import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';

const CreateTodoModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [subTasks, setSubTasks] = useState([{ title: '', completed: false }]);
  const [tags, setTags] = useState('');

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, { title: '', completed: false }]);
  };

  const handleSubTaskChange = (index, value) => {
    const updatedSubTasks = [...subTasks];
    updatedSubTasks[index].title = value;
    setSubTasks(updatedSubTasks);
  };

  const handleTagChange = (e) => {
    setTags(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const todoData = {
      title,
      description,
      dueDate,
      subTasks,
      tags: tags.split(',').map(tag => tag.trim()), // Convert comma-separated tags to an array
    };

    try {
      await onCreate(todoData);
      onClose(); // Close the modal after creation
      // Reset fields
      setTitle('');
      setDescription('');
      setDueDate('');
      setSubTasks([{ title: '', completed: false }]);
      setTags('');
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg w-1/3">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Create Todo</h2>
            <button onClick={onClose} className="text-gray-500">
              <FaTimes />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border p-2 w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">Subtasks</label>
              {subTasks.map((subTask, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={subTask.title}
                    onChange={(e) => handleSubTaskChange(index, e.target.value)}
                    className="border p-2 flex-1 mr-2"
                    placeholder="Subtask title"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSubTask}
                className="text-blue-600"
              >
                + Add Subtask
              </button>
            </div>
            <div className="mb-4">
              <label className="block mb-1">Tags (comma separated)</label>
              <input
                type="text"
                value={tags}
                onChange={handleTagChange}
                className="border p-2 w-full"
              />
            </div>
            <button
              type="submit"
              className="bg-teal-600 text-white py-2 px-4 rounded-full"
            >
              Create Todo
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateTodoModal;
