import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTodos } from "../hooks/useTodos";
import { FaPlus, FaSearch } from "react-icons/fa";
import CreateTodoModal from "../components/todoModals/CreateTodoModal";
import TodoItem from "../components/todo/TodoItem";
import { useProjectsContext } from "../hooks/useProjects";
import { Checkbox, Skeleton, DatePicker, CheckboxGroup } from "@nextui-org/react";
import { Dialog, DialogActions, DialogContent } from "@mui/material";

function ProjectPage() {

  const { projectId } = useParams();
  const { projects, updateProject, inviteCollaborator } = useProjectsContext();
  const { addTodo, updateTodo, deleteTodo, fetchTodosByProject } = useTodos();
  const [todos, setTodos] = useState([]);
  console.log(todos)
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [error, setError] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isTagDropdownVisible, setIsTagDropdownVisible] = useState(false);

  const [isEditingTitle, setIsEditingTitle] = useState(false); // State for editing title
  const [isEditingDescription, setIsEditingDescription] = useState(false); // State for editing description
  const [newTitle, setNewTitle] = useState(""); // State for new title
  const [newDescription, setNewDescription] = useState(""); // State for new description
  const [isRescheduling, setIsRescheduling] = useState(false); // New state for rescheduling
  const [isInviteDropdownVisible, setIsInviteDropdownVisible] = useState(false);
  const [emailToInvite, setEmailToInvite] = useState("");
  console.log(emailToInvite, projectId)


  const project = projects.find((project) => project._id === projectId);
  const [dueDate, setDueDate] = useState(null);

  useEffect(() => {
    const getTodos = async () => {
      try {
        setLoading(true);
        const data = await fetchTodosByProject(projectId);
        setTodos(data);
        setFilteredTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTodos();
  }, [projectId]);

  useEffect(() => {
    filterAndSortTodos();
  }, [todos, searchTerm, showCompleted, projectId, selectedTags]);

  useEffect(() => {
    if (todos.length) {
      const tags = getUniqueTags(todos);
      setAvailableTags(tags);
    }
  }, [todos, projectId]);

  const filterAndSortTodos = () => {
    const filtered = todos.filter((todo) => {
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCompletion = showCompleted || !todo.completed;

      // Check if any selected tag is present in the todo's tags
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) =>
          (todo.tags || []).map((t) => t.toLowerCase()).includes(tag)
        );

      return matchesSearch && matchesCompletion && matchesTags;
    });

    setFilteredTodos(filtered);
  };

  const toggleCompletion = async (id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    const updatedTodo = await updateTodo(id, {
      completed: !todos.find((todo) => todo._id === id).completed,
    });
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === updatedTodo._id ? updatedTodo : todo
      )
    );
  };

  const handleTaskSelection = (todo) => {
    setSelectedTodo(todo);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      closeWarningModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCreateTodo = async (todoData) => {
    const newTodo = await addTodo(todoData);
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  const openWarningModal = () => {
    setIsWarningModalOpen(true);
  };

  const closeWarningModal = () => {
    setIsWarningModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleShowCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  const handleStartProject = async () => {
    if (project.status === "pending") {
      await updateProject(projectId, { status: "in-progress" });
    }
  };

  const handleCheckboxChange = async () => {
    if (project.status === "in-progress") {
      await updateProject(projectId, { status: "completed" });
    } else if (project.status === "completed") {
      await updateProject(projectId, { status: "in-progress" });
    }
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
    setNewTitle(project.name);
  };

  const handleDescriptionEdit = () => {
    setIsEditingDescription(true);
    setNewDescription(project.description);
  };

  const handleTitleSave = async () => {
    await updateProject(projectId, { name: newTitle });
    setIsEditingTitle(false);
  };

  const handleDescriptionSave = async () => {
    await updateProject(projectId, { description: newDescription });
    setIsEditingDescription(false);
  };

  const groupTodosByDate = (todos) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0);

    const groupedTodos = {
      Overdue: [],
      Today: [],
      Tomorrow: [],
      "This Week": [],
      Later: [],
    };

    todos.forEach((todo) => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        groupedTodos.Overdue.push(todo);
      } else if (dueDate.toDateString() === today.toDateString()) {
        groupedTodos.Today.push(todo);
      } else if (dueDate.toDateString() === tomorrow.toDateString()) {
        groupedTodos.Tomorrow.push(todo);
      } else if (dueDate > today && dueDate <= nextWeek) {
        groupedTodos["This Week"].push(todo);
      } else {
        groupedTodos.Later.push(todo);
      }
    });

    return groupedTodos;
  };

  const calculateProgress = () => {
    const totalTodos = todos.length;
    const completedTodos = todos.filter((todo) => todo.completed).length;
    return totalTodos === 0 ? 0 : (completedTodos / totalTodos) * 100; // Returns a percentage
  };

  const handleDueDateChange = (selectedDate) => {
    setDueDate(selectedDate);
  };

  const handleSaveDueDate = async () => {
    if (dueDate) {
      // Convert the {day, month, year} to a JavaScript Date object
      const formattedDueDate = new Date(
        dueDate.year,
        dueDate.month - 1,
        dueDate.day
      );

      await updateProject(projectId, {
        dueDate: formattedDueDate.toISOString(),
      });

      setIsRescheduling(false);
    }
  };

  const getUniqueTags = (todos) => {
    const allTags = todos.flatMap((todo) => todo.tags || []);
    const uniqueTags = [...new Set(allTags.map((tag) => tag.toLowerCase()))];
    return uniqueTags;
  };


  const groupedTodos = groupTodosByDate(filteredTodos);
  const progress = calculateProgress();

  return (
    <div className="p-6 lg:w-2/3 md:w-full">
      <div className="flex mb-3 items-center">
        {project?.status !== "pending" && (
          <Checkbox
            radius="full"
            isSelected={project ? project.status === "completed" : ""}
            onChange={handleCheckboxChange}
            color="danger"
            size="lg"
          />
        )}
        {isEditingTitle ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleTitleSave}
            className="text-3xl font-bold border-none outline-none"
          />
        ) : (
          <h1
            onClick={handleTitleEdit}
            className="text-3xl font-bold cursor-pointer"
          >
            {project && project.name}
          </h1>
        )}
      </div>

      <p className="mb-4 text-lg">
        {isEditingDescription ? (
          <input
            type="text"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onBlur={handleDescriptionSave}
            className="border-none outline-none"
          />
        ) : (
          <span onClick={handleDescriptionEdit} className="cursor-pointer">
            {project?.description}
          </span>
        )}
      </p>

      {project?.status === "pending" && (
        <button
          onClick={handleStartProject}
          className="px-5 py-1 mb-4 text-white bg-red-500 rounded hover:bg-red-600"
        >
          Start Project
        </button>
      )}

      {project && (
        <div className="flex flex-wrap items-center space-x-2 mb-4">

          <p className="text-sm text-gray-600">
            {project?.dueDate ? (
              <>
               Due Date: {new Date(project.dueDate).toLocaleDateString()}
              </>
            ) : 
            'No Due Date Set Yet'
            }
            
          </p>

          {!isRescheduling ? (
            // Render Reschedule button when not in rescheduling mode
            <button
              onClick={() => setIsRescheduling(true)} // Toggle rescheduling mode
              className="rounded px-3 py-1 border-1 text-accent hover:bg-secondary"
            >
              Reschedule
            </button>
          ) : (
            // Render DatePicker and action buttons when in rescheduling mode
            <div className="flex space-x-2 space-y-2 sm:space-y-0 flex-col sm:flex-row">
              <DatePicker
                
                value={dueDate}
                onChange={handleDueDateChange} 
                variant="bordered"// Handle date change
              />
              <button
                className="rounded px-3 py-1 border-1 hover:bg-secondary text-accent"
                onClick={handleSaveDueDate} // Save the new date
              >
                Save
              </button>
              <button
                className="rounded px-3 py-1 bg-gray-400 text-white"
                onClick={() => setIsRescheduling(false)} // Cancel rescheduling
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

<button
  onClick={() => setIsInviteDropdownVisible(prev => !prev)}
  className="px-3 py-1 ml-2 text-accent border-1 rounded"
>
  Invite your friend
</button>

{isInviteDropdownVisible && (
  <div className="absolute mt-2 z-10 p-4 bg-white border border-gray-300 rounded shadow-lg w-64">
    <input
      type="email"
      value={emailToInvite}
      onChange={(e) => setEmailToInvite(e.target.value)}
      placeholder="Enter email"
      className="w-full p-2 mb-2 border rounded focus:outline-none"
    />

    <button
  onClick={() => {
    inviteCollaborator(projectId, emailToInvite);
    setEmailToInvite(""); // Optionally, clear the input after inviting
    setIsInviteDropdownVisible(false); // Hide the dropdown after invite
  }}
  className="px-3 py-1 text-white bg-red-500 rounded hover:bg-red-600"
>
  Invite
</button>

  </div>
)}



      <div className="my-2 w-1/2">
        <span className="text-sm">{`Progress: ${Math.round(progress)}%`}</span>
        <div className="relative bg-gray-200 rounded h-2">
          <div
            className="absolute top-0 left-0 h-2 bg-red-500 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-4">
      <div className="flex flex-wrap items-center mb-6 sm:w-auto space-y-3 md:space-y-0 ">
        <div className="flex items-center w-full sm:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search todo..."
            className="p-2 px-4 mr-2 w-full sm:w-auto border rounded focus:ring-1 focus:outline-none focus:ring-zinc-400"
          />
          <FaSearch />
        </div>

        <label className="flex items-center ml-2 ">
          <Checkbox
            radius="full"
            isSelected={showCompleted}
            onChange={toggleShowCompleted}
            color="default"
            size="lg"
            css={{ margin: 0 }}
          />
          <span className="">Show Completed</span>
        </label>

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsTagDropdownVisible((prev) => !prev)}
            className="px-3 py-1 ml-2 text-accent border-1 rounded"
          >
            {isTagDropdownVisible ? "Hide Tags" : "Select Tags"}
          </button>

          {isTagDropdownVisible && (
            <div
              className="absolute z-10 p-4 mt-2 bg-white border border-gray-300 rounded shadow-lg w-full sm:w-64"
              style={{ minWidth: "200px" }} // Optional: define the width of the dropdown
            >
              <CheckboxGroup
                label="Filter by tags"
                value={selectedTags}
                onChange={setSelectedTags}
                orientation="horizontal"
              >
                {availableTags.map((tag) => (
                  <Checkbox color="danger" key={tag} value={tag}>
                    {tag}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </div>
          )}
        </div>
      </div>
        {error && <p className="text-red-500">{error}</p>}

        <div className="flex">
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
        </div>
      </div>

      <CreateTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTodo}
      />

      <Dialog
        open={isWarningModalOpen}
        onClose={closeWarningModal}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogContent>
          <p>Are you sure you want to delete this todo?</p>
        </DialogContent>
        <DialogActions>
          <button
            onClick={closeWarningModal}
            className="px-2 py-1 text-white rounded bg-accent hover:bg-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(selectedTodo._id)}
            className="px-2 py-1 mr-2 text-white rounded bg-danger hover:bg-red-400"
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ProjectPage;
