// src/components/TodoDetailsSidebar.js

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaRegFileAlt, FaTag, FaCalendarAlt, FaPlus, FaMinus } from 'react-icons/fa';

function TodoDetailsSidebar({ todo, onClose, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTodo, setEditableTodo] = useState({});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setEditableTodo({
      title: todo?.title || '',
      description: todo?.description || '',
      dueDate: todo?.dueDate || '',
      subTasks: todo?.subTasks || [],
      tags: todo?.tags || [],
    });
  }, [todo]);

  if (!todo) return null;

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditableTodo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubTaskChange = (index, value) => {
    const updatedSubTasks = [...editableTodo.subTasks];
    updatedSubTasks[index].title = value;
    setEditableTodo((prev) => ({ ...prev, subTasks: updatedSubTasks }));
  };

  const handleAddSubTask = () => {
    setEditableTodo((prev) => ({
      ...prev,
      subTasks: [...prev.subTasks, { title: '' }],
    }));
  };

  const handleDeleteSubTask = (index) => {
    const updatedSubTasks = editableTodo.subTasks.filter((_, i) => i !== index);
    setEditableTodo((prev) => ({ ...prev, subTasks: updatedSubTasks }));
  };

  const handleAddTag = () => {
    if (newTag.trim() === '') return;
    setEditableTodo((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));
    setNewTag('');
  };

  const handleDeleteTag = (index) => {
    const updatedTags = editableTodo.tags.filter((_, i) => i !== index);
    setEditableTodo((prev) => ({ ...prev, tags: updatedTags }));
  };

  const handleSave = () => {
    onEdit(editableTodo);
    setIsEditing(false);
  };

  // Function to handle subtask completion toggle
  const handleSubTaskToggle = (index) => {
    const updatedSubTasks = [...editableTodo.subTasks];
    updatedSubTasks[index].completed = !updatedSubTasks[index].completed;
    setEditableTodo((prev) => ({ ...prev, subTasks: updatedSubTasks }));
    onEdit({ ...editableTodo, subTasks: updatedSubTasks }); // Update parent component
  };

  return (
    <div className="fixed top-0 right-0 w-1/4 h-full bg-secondary p-5 z-50 overflow-y-auto">
      <button onClick={onClose} className=" mb-4">✖</button>

      {isEditing ? (
        <>
          <h3 className="text-2xl font-bold mb-4">Edit Todo</h3>
          <div className="mb-4">
            <label className="flex items-center mb-2">
              <FaRegFileAlt className="mr-2 text-gray-600" />
              <span className="text-lg font-semibold">Title</span>
            </label>
            <input
              type="text"
              name="title"
              value={editableTodo.title}
              onChange={handleEditChange}
              className="border bg-transparent mb-2 w-full p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center mb-2">
              <FaRegFileAlt className="mr-2 text-gray-600" />
              <span className="text-lg font-semibold">Description</span>
            </label>
            <textarea
              name="description"
              value={editableTodo.description}
              onChange={handleEditChange}
              className="border bg-transparent mb-2 w-full p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description"
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center mb-2">
              <FaCalendarAlt className="mr-2 text-gray-600" />
              <span className="text-lg font-semibold">Due Date</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={editableTodo.dueDate.split('T')[0]} 
              onChange={handleEditChange}
              className="border bg-transparent mb-2 w-full p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <h3 className="text-lg font-semibold mt-4">Subtasks</h3>
          {editableTodo.subTasks.map((subTask, index) => (
            <div key={index} className="mb-2 flex items-center">
              <input
                type="text"
                value={subTask.title}
                onChange={(e) => handleSubTaskChange(index, e.target.value)}
                className="border bg-transparent mb-2 w-full p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-200"
                placeholder="Subtask"
              />
              <button
                onClick={() => handleDeleteSubTask(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                <FaMinus />
              </button>
            </div>
          ))}
          <button
            onClick={handleAddSubTask}
            className="bg-teal-500 text-white py-1 px-2 rounded-xl shadow flex items-center mt-2 hover:bg-teal-600 transition"
          >
            <FaPlus className="mr-2" /> Add Subtask
          </button>

          <h3 className="text-lg font-semibold mt-4">Tags</h3>
          <div className="flex flex-wrap mb-2">
            {editableTodo.tags.map((tag, index) => (
              <div key={index} className="flex items-center mr-2 mb-2 bg-opacity-75 bg-slate-200 text-neutral-800 font-bold rounded-lg px-4 py-2">
                {tag}
                <button
                  onClick={() => handleDeleteTag(index)}
                  className="ml-2 text-red-600 hover:text-red-700"
                >
                  <FaMinus size={10} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex items-center mb-4">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="border bg-transparent mb-2 w-full p-2 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-zinc-200"
              placeholder="Add a new tag"
            />
            <button
              onClick={handleAddTag}
              className="bg-teal-500 text-white py-2 px-2 rounded-full shadow flex items-center ml-2 hover:bg-teal-600 transition"
            >
              <FaPlus />
            </button>
          </div>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleSave}
              className="bg-accent text-white py-2 px-4 rounded-full shadow hover:bg-neutral-800 transition"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-accent text-white py-2 px-4 rounded-full shadow hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">{todo.title}</h2>
          <p className="text-gray-600 mb-4">
            <span className="font-semibold">Description:</span> {todo.description || 'No details available'}
          </p>

          {todo.dueDate && (
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-gray-600 mr-2" />
              <p className="font-semibold text-gray-800">Due Date:</p>
              <span className="ml-1 text-gray-700">{new Date(todo.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          <hr />

          {todo.subTasks && todo.subTasks.length > 0 && (
            <div className="mb-4 p-4 ">
              <h3 className="text-lg font-semibold mb-2">Subtasks</h3>
              <ul className="list-disc list-inside">
                {todo.subTasks.map((subTask, index) => (
                  <li key={index} className={`flex items-center py-1`}>
                    <input
                      type="checkbox"
                      checked={subTask.completed}
                      onChange={() => handleSubTaskToggle(index)} // Toggle checkbox
                      className="mr-2"
                    />
                    <span className={subTask.completed ? 'line-through text-gray-500' : 'text-gray-800'}>
                      {subTask.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <hr />

          {todo.tags && todo.tags.length > 0 && (
            <div className="mb-4 p-4 ">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap">
                {todo.tags.map((tag, index) => (
                  <span key={index} className="bg-zinc-200 text-neutral-800 rounded-lg px-4 py-2 mr-2 mb-2 transition-colors duration-200 hover:bg-neutral-300 ">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-row-reverse gap-x-2 mt-4">
            <button
              onClick={() => {
                setIsEditing(true);
                setEditableTodo({ ...todo });
              }}
              className="bg-neutral-900 text-white py-2 px-4 rounded-lg flex items-center shadow hover:bg-neutral-700 transition"
            >
              <FaEdit className="mr-2" /> Edit
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white py-2 px-4 rounded-lg flex items-center shadow hover:bg-red-600 transition"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default TodoDetailsSidebar;
