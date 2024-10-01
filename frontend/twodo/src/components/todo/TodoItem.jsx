import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { LuListTree } from "react-icons/lu";
import  './TodoItem.css';

const TodoItem = ({ todo, toggleCompletion, handleTaskSelection }) => {

  
  // Function to handle due date formatting
  const getDueDateLabel = (dueDate) => {
    if (!dueDate) return null;

    const today = new Date();
    const date = new Date(dueDate);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString();
    const isYesterday = date.toDateString() === new Date(today.setDate(today.getDate() - 2)).toDateString();

    if (isToday) {
      return <span className="text-green-500">Today</span>;
    } else if (isTomorrow) {
      return <span className="text-blue-500">Tomorrow</span>;
    } else if (isYesterday) {
      return <span className="text-red-500">Yesterday</span>;
    } else {
      return <span>{date.toLocaleDateString()}</span>;
    }
  };

  return (
    <li className="p-3 transition-all duration-200 ">
      <div className="flex justify-between items-start mb-">
        <div className="flex items-center">
          {/* Custom circle checkbox */}
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleCompletion(todo._id)}
            className="custom-checkbox w-6 h-6 mr-4 cursor-pointer"
          />
          {/* Task title, with line-through if completed */}
          <span className={`font-semibold text-lg ${todo.completed ? 'line-through text-accent' : ''}`}>
            {todo.title}
          </span>
        </div>

        <button
          onClick={() => handleTaskSelection(todo)} 
          className="ml-2 text-accent"
        >
          <FaChevronRight />
        </button>
      </div>
      
      {/* Additional details: description, due date, and tags */}
      <div className="pl-10">
        {todo.description && (
          <p className="text-sm text-gray-500 mb-1">{todo.description}</p>
        )}
        <div className="text-sm text-gray-500 flex items-center space-x-4">
          {todo.dueDate && (
            <span className="flex items-center">
              <span className="mr-1">📅</span> 
              {getDueDateLabel(todo.dueDate)}
            </span>
          )}
          {todo.subTasks.length > 0 && (
             <span className="flex items-center">
             <span className="text-accent mr-1"><LuListTree /></span> 
             <span>{todo.subTasks.length}</span>
           </span>
          )}
          {/* Display tags if available */}
          {todo.tags.length > 0 && (
            <span className="flex items-center">
              <span className="mr-1">🏷️</span> 
              <span>{todo.tags.join(', ')}</span>
            </span>
          )}
        </div>
      </div>
    </li>
  );
};

export default TodoItem;
