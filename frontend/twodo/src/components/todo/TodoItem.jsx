import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { LuListTree } from "react-icons/lu";
import { Checkbox } from "@nextui-org/react"; 

const TodoItem = ({ todo, toggleCompletion, handleTaskSelection }) => {

  // Function to handle due date formatting
  const getDueDateLabel = (dueDate) => {
    if (!dueDate) return null;

    const today = new Date();
    const date = new Date(dueDate);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === new Date(today.setDate(today.getDate() + 1)).toDateString();
    const isYesterday = date.toDateString() === new Date(today.setDate(today.getDate() - 2)).toDateString();
    const isPast = date < new Date() && !isYesterday;

    if (isToday) {
      return <span className="text-green-500">Today</span>;
    } else if (isTomorrow) {
      return <span className="text-blue-500">Tomorrow</span>;
    } else if (isYesterday) {
      return <span className="text-red-500">Yesterday</span>;
    } else if (isPast) {
      return <span className="text-red-500">Overdue</span>;
    } else {
      return <span>{date.toLocaleDateString()}</span>;
    }
  };

  return (
    <li className="p-3 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          {/* NextUI Full Rounded Checkbox */}
          <Checkbox
            radius='full'
            isSelected={todo.completed}
            onChange={() => toggleCompletion(todo._id)}
            color="danger" 
            size="lg" 
            css={{ margin: 0 }}
          />

          {/* Wrapping title and description in a block for proper alignment */}
          <div className="ml-4">
            {/* Task title, with line-through if completed */}
            <span className={`font-semibold text-lg ${todo.completed ? 'line-through text-accent' : ''}`}>
              {todo.title}
            </span>

            {/* Description (aligned with title) */}
            {todo.description && (
              <p className="mb-1 text-sm text-gray-500">{todo.description}</p>
            )}

            {/* Additional details: due date, subtasks, and tags */}
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              {todo.dueDate && (
                <span className="flex items-center">
                  <span className="mr-1">📅</span> 
                  {getDueDateLabel(todo.dueDate)}
                </span>
              )}
              {todo.subTasks.length > 0 && (
                <span className="flex items-center">
                  <span className="mr-1 text-accent"><LuListTree /></span> 
                  <span>{todo.subTasks.length}</span>
                </span>
              )}
              {/* Display each tag with a separate tag icon */}
              {todo.tags.length > 0 && (
                <span className="flex items-center">
                  {todo.tags.map((tag, index) => (
                    <span key={index} className="flex items-center mr-2">
                      <span className="mr-1">🏷️</span>
                      <span>{tag}</span>
                    </span>
                  ))}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Chevron button */}
        <button
          onClick={() => handleTaskSelection(todo)}
          className="ml-2 text-accent"
        >
          <FaChevronRight />
        </button>
      </div>
    </li>
  );
};

export default TodoItem;
