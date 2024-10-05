import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { LuListTree } from "react-icons/lu";
import { Checkbox } from "@nextui-org/react";
import { useTodos } from "../../hooks/useTodos";
import { AiOutlineFundProjectionScreen } from "react-icons/ai";
import { useProjectsContext } from "../../hooks/useProjects";
import { DatePicker } from "@nextui-org/react";
import { TiDelete } from "react-icons/ti";
import { RiQuillPenLine } from "react-icons/ri";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";
import "./Todo.css";
const TodoItem = ({
  todo,
  toggleCompletion,
  handleTaskSelection,
  onDelete,
  setTodos,
}) => {
  const { projects } = useProjectsContext();
  const { updateTodo } = useTodos();
  const [selectedProject, setSelectedProject] = useState(todo.project);

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [editedTodo, setEditedTodo] = useState({
    title: todo.title,
    description: todo.description,
    dueDate: todo.dueDate,
    tags: todo.tags || [],
  });
  const [editedSubtasks, setEditedSubtasks] = useState(todo.subTasks);
  const [newSubtask, setNewSubtask] = useState("");

  // Effect to reset editedTodo when isEditing changes
  useEffect(() => {
    if (isEditing) {
      setEditedTodo({
        title:
          todo.title +
          (todo.tags.length > 0
            ? " " + todo.tags.map((tag) => `@${tag}`).join(" ")
            : ""),
        description: todo.description,
        dueDate: todo.dueDate,
        tags: todo.tags || [],
      });
    }
  }, [isEditing, todo]);

  // State for managing subtasks visibility
  const [isSubtasksVisible, setSubtasksVisible] = useState(false);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedTodo((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      const newTags =
        value.match(/@(\w+)/g)?.map((tag) => tag.substring(1)) || [];
      setEditedTodo((prev) => ({ ...prev, tags: newTags }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditedTodo((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = async () => {
    try {
      const cleanedTitle = editedTodo.title.replace(/@(\w+)/g, "").trim();

      const formattedTodo = {
        ...editedTodo,
        title: cleanedTitle,
        dueDate:
          typeof editedTodo.dueDate === "object"
            ? new Date(
                editedTodo.dueDate.year,
                editedTodo.dueDate.month - 1,
                editedTodo.dueDate.day
              ).toISOString()
            : editedTodo.dueDate,
        subTasks: editedSubtasks,
        project: selectedProject,
      };

      const updatedTodo = await updateTodo(todo._id, formattedTodo);

      setTodos((prevTodos) =>
        prevTodos.map((t) => (t._id === updatedTodo._id ? updatedTodo : t))
      );

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update todo", error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTodo({
      title:
        todo.title +
        (todo.tags.length > 0
          ? " " + todo.tags.map((tag) => `@${tag}`).join(" ")
          : ""),
      description: todo.description,
      dueDate: todo.dueDate,
      tags: todo.tags || [],
    });
  };

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

  const handleDelete = (todo) => {
    handleTaskSelection(todo);
    onDelete();
  };

  const project = projects.find((project) => project._id === todo.project);

  // New function to handle subtask completion
  const handleSubtaskToggle = async (subtaskId) => {
    const updatedSubTasks = todo.subTasks.map((subtask) =>
      subtask._id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );

    const updatedTodo = { ...todo, subTasks: updatedSubTasks };
    await updateTodo(todo._id, updatedTodo);
    setTodos((prevTodos) =>
      prevTodos.map((t) => (t._id === todo._id ? updatedTodo : t))
    );
  };

  const handleSubtaskEditChange = (index, value) => {
    const updatedSubtasks = editedSubtasks.map((subtask, i) =>
      i === index ? { ...subtask, title: value } : subtask
    );
    setEditedSubtasks(updatedSubtasks);
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      // Ensure the input is not empty
      const newSubtaskObj = {
        title: newSubtask,
        completed: false, // Default to not completed
      };

      // Update your editedSubtasks state
      setEditedSubtasks((prev) => [...prev, newSubtaskObj]);

      // Clear the input field
      setNewSubtask("");
    }
  };

  const handleSubtaskDelete = (subtaskId) => {
    setEditedSubtasks((prev) =>
      prev.filter((subtask) => subtask._id !== subtaskId)
    );
  };

  return (
    <li
    className={`p-3 ${isEditing && "border-1 rounded-xl"} cursor-pointer`}
    onClick={() => setSubtasksVisible(!isSubtasksVisible)} // Toggle subtasks visibility on click
  >
    <div className="flex items-start justify-between">
      <div className="flex w-full items-start">
        {/* Render Checkbox only when not in editing mode */}
        {!isEditing && (
          <Checkbox
            radius="full"
            isSelected={todo.completed}
            onChange={() => toggleCompletion(todo._id)}
            color="danger"
            size="lg"
            css={{ margin: 0 }}
          />
        )}
        <div className="ml-4 w-full">
          {isEditing ? (
            <>
              <span
                className={`flex font-semibold ${
                  todo.completed ? "line-through text-accent" : ""
                }`}
              >
                <input
                  type="text"
                  name="title"
                  value={editedTodo.title}
                  onChange={handleEditChange}
                  placeholder="Title; type @tag to add tags"
                  className=" md:text-lg text-xs border-0 outline-none w-full text-ellipsis"
                />
              </span>
              <input
                name="description"
                value={editedTodo.description}
                onChange={handleEditChange}
                className="w-full text-ellipsis text-xs md:text-lg border-0 outline-none"
                rows="1"
                placeholder="Description"
              />
              <div className="flex sm:items-center sm:flex-row flex-col space-y-2 sm:space-y-0 mt-1 mb-2 ">
                <div className="w-40 mr-2">
                  <DatePicker
                    variant="bordered"
                    selected={
                      editedTodo.dueDate ? new Date(editedTodo.dueDate) : null
                    }
                    onChange={(date) =>
                      setEditedTodo((prev) => ({ ...prev, dueDate: date }))
                    }
                    size="sm"
                  />
                </div>
  
                <div >
                  {editedTodo.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center md:text-md text-xs px-2 py-1 mr-2 space-x-2 text-accent border-1 rounded "
                    >
                      <span className="font-semibold">{tag}</span>
                      <button
                        type="button"
                        className="md:text-lg sm:text-sm ml-1 hover:text-black "
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <TiDelete />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <hr className="mt-3 mb-2" />
              <span className="text-sm sm:text-lg">Subtasks:</span>
              <div className="ml-8 mb-3 mt-1">
                {editedSubtasks.map((subtask, index) => (
                  <div
                    key={subtask._id}
                    className="flex items-center justify-normal"
                  >
                    -
                    <input
                      type="text"
                      value={subtask.title}
                      onChange={(e) =>
                        handleSubtaskEditChange(index, e.target.value)
                      }
                      className={`text-xs sm:text-lg outline-none border-0  ml-2  text-gray-500 `}
                    />
                    <button
                      onClick={() => handleSubtaskDelete(subtask._id)}
                      className="ml-2 text-red-500"
                    >
                      <TiDelete />
                    </button>
                  </div>
                ))}
  
                <div className="flex items-center mt-2">
                  <input
                    type="text"
                    placeholder="Add New Subtask"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    className="text-xs sm:text-lg border-0 outline-none rounded p-1 "
                  />
  
                  <button
                    className="text-xs sm:text-lg hover:text-accent"
                    onClick={handleAddSubtask}
                  >
                    <IoIosAddCircle />
                  </button>
                </div>
              </div>
              <hr />
  
              <div className="flex justify-between items-center mt-2 text-xs md:text-lg">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="" disabled={!selectedProject}>
                    {selectedProject ? "Change project" : "Select a project"}
                  </option>
                  <option value="">No Project</option>
                  {projects.map((proj) => (
                    <option className="text-xs md:text-lg" key={proj._id} value={proj._id}>
                      {proj.name}
                    </option>
                  ))}
                </select>
  
                <div className="space-x-2">
                  <button
                    onClick={handleCancel}
                    className="text-xs md:text-lg bg-gray-500 text-primary py-1 px-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
  
                  <button
                    onClick={handleSave}
                    className="text-accent text-xs md:text-lg bg-third px-3 py-1 rounded hover:bg-gray-300"
                  >
                    Save
                  </button>
                </div>
              </div>
            </>
          ) : (
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
                  {todo.subTasks.map((subtask) => (
                    <div key={subtask._id} className="flex items-center">
                      <Checkbox
                        radius={"full"}
                        isSelected={subtask.completed}
                        onChange={() => handleSubtaskToggle(subtask._id)}
                        color="danger"
                        size="sm"
                        css={{ margin: 0 }}
                      />
                      <span
                        className={`ml-2 ${
                          subtask.completed ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {subtask.title}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
  
      {/* Render Action Buttons only when not in editing mode */}
      {!isEditing && (
        <div className="flex items-center action-buttons ">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="ml-2 md:text-2xl sm:text-sm text-accent"
          >
            <RiQuillPenLine />
          </button>
          <button
            onClick={() => handleDelete(todo)}
            className="ml-2 md:text-2xl sm:text-sm text-red-500"
          >
            <MdOutlineDeleteOutline />
          </button>
        </div>
      )}
    </div>
  </li>
  
  );
};

export default TodoItem;
