import React from "react";
import TodoItem from "../todo/TodoItem";
import { Skeleton } from "@nextui-org/react";
import { FaPlus, FaSearch } from "react-icons/fa";
const TodoList = ({ loading, groupedTodos, toggleCompletion, handleTaskSelection, openWarningModal,setIsModalOpen , setTodos }) => (
  <ul className="min-w-full divide-y">

    <li
      onClick={() => setIsModalOpen(true)}
      className="flex items-center justify-start p-3 px-5 border rounded cursor-pointer hover:bg-slate-50 border-neutral-200"
    >
      <span>
        <FaPlus size={15} className="mr-2 " />
      </span>
      <span className="font-semibold">Add new task</span>
    </li>
    {loading
      ? Array.from({ length: 3 }).map((_, index) => (
          <li key={index} className="p-3 mb-2">
            <div className="max-w-[300px] w-full flex items-center gap-3">
              <div>
                <Skeleton className="flex rounded-full mb-7 w-7 h-7" />
              </div>
              <div className="flex flex-col w-full gap-2">
                <Skeleton className="w-2/5 h-4 rounded-lg" />
                <Skeleton className="w-4/5 h-3 rounded-lg" />
                <Skeleton className="w-2/5 h-3 rounded-lg" />
              </div>
            </div>
          </li>
        ))
      : Object.entries(groupedTodos).map(
          ([dateLabel, todos]) =>
            todos.length > 0 && (
              <div key={dateLabel}>
                <h2 className="mt-4 text-lg font-bold">{dateLabel}</h2>
                {todos.map((todo) => (
                  <TodoItem
                    key={todo._id}
                    todo={todo}
                    toggleCompletion={toggleCompletion}
                    handleTaskSelection={handleTaskSelection}
                    onDelete={openWarningModal}
                    setTodos={setTodos}
                  />
                ))}
              </div>
            )
        )}
  </ul>
);

export default TodoList;
