import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaRegFileAlt, FaTag, FaCalendarAlt, FaPlus, FaMinus } from 'react-icons/fa';

function TodoDetailsModal({ todo, onClose, onDelete, onEdit }) {
  const [editableTodo, setEditableTodo] = useState({});
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (todo) {
      setEditableTodo({
        title: todo.title || '',
        description: todo.description || '',
        dueDate: todo.dueDate || '',
        subTasks: todo.subTasks || [],
        tags: todo.tags || [],
      });
    }
  }, [todo]);

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
      subTasks: [...prev.subTasks, { title: '', completed: false }],
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
    onClose();
  };

  const handleSubTaskToggle = (index) => {
    const updatedSubTasks = [...editableTodo.subTasks];
    updatedSubTasks[index].completed = !updatedSubTasks[index].completed;
    setEditableTodo((prev) => ({ ...prev, subTasks: updatedSubTasks }));
  };

  if (!todo) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-5 w-2/3 md:w-1/3 relative overflow-y-auto">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">✖</button>

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
            className="bg-black text-white py-2 px-4 rounded-full shadow hover:bg-neutral-800 transition"
          >
            Save
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 text-white py-2 px-4 rounded-full shadow hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoDetailsModal;
