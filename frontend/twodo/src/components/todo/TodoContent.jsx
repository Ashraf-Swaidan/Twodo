import React from 'react'
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { Link } from "react-router-dom";
import { LuListTree } from "react-icons/lu";
import { Checkbox } from "@nextui-org/react";

const TodoContent = ({todo, handleSubtaskToggle, project, isSubtasksVisible, userRole}) => {

    const getDueDateLabel = (dueDate) => {
        if (!dueDate) return null;
        const today = new Date();
        const date = new Date(dueDate);
        const isToday = date.toDateString() === today.toDateString();
        const isTomorrow =
          date.toDateString() ===
          new Date(today.setDate(today.getDate() + 1)).toDateString();
        const isYesterday =
          date.toDateString() ===
          new Date(today.setDate(today.getDate() - 2)).toDateString();
        const isPast = date < new Date() && !isYesterday;
    
        if (isToday) return <span className="text-green-500">Today</span>;
        else if (isTomorrow) return <span className="text-blue-500">Tomorrow</span>;
        else if (isYesterday)
          return <span className="text-red-500">Yesterday</span>;
        else if (isPast) return <span className="text-red-500">Overdue</span>;
        else return <span>{date.toLocaleDateString()}</span>;
      };

      

  return (
    <>
    <span
      className={`font-semibold md:text-lg sm:text-sm ${
        todo.completed ? "line-through text-accent" : ""
      }`}
    >
      {todo.title}
    </span>
    {todo.description && (
      <p className="mb-1 md:text-sm sm:text-xs text-gray-500">
        {todo.description}
      </p>
    )}
    <div className="flex items-center justify-normal space-x-4 md:text-sm sm:text-xs text-gray-500">
      <div className="lg:flex lg:space-x-3 sm:space-y-1">
        {todo.dueDate && (
          <span className="flex items-center">
            <span className="mr-1">📅</span>
            {getDueDateLabel(todo.dueDate)}
          </span>
        )}
        {todo.subTasks.length > 0 && (
          <span className="flex items-center">
            <span className="mr-1 text-accent">
              <LuListTree />
            </span>
            <span>
              {
                todo.subTasks.filter((subtask) => subtask.completed)
                  .length
              }{" "}
              / {todo.subTasks.length}
            </span>
          </span>
        )}

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
        {project && (
          <span className="flex items-center">
            <span className="mr-1 text-accent">
              <AiOutlineFundProjectionScreen />
            </span>
            <Link to={`/project/${todo.project}`}>
              <span>{project.name}</span>
            </Link>
          </span>
        )}
      </div>
    </div>
    {isSubtasksVisible && (
      <div className="ml-8 mt-2">
        <span className='text-md'>Subtasks:</span>
        {todo.subTasks.map((subtask) => (
          <div key={subtask._id} className="flex items-center">
            <Checkbox
              radius={"full"}
              isSelected={subtask.completed}
              onChange={() => handleSubtaskToggle(subtask._id)}
              color="danger"
              size="sm"
              css={{ margin: 0 }}
              isDisabled={userRole === "viewer"}
            />
            <span
              className={`ml-2 ${
                subtask.completed
                  ? "line-through text-gray-500"
                  : ""
              }`}
            >
              {subtask.title}
            </span>
          </div>
        ))}
      </div>
    )}

  </>

  )
}

export default TodoContent