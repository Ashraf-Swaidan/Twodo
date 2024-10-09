import React, { useEffect, useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { FaPlus, FaSearch } from "react-icons/fa";
import CreateTodoModal from "../components/todoModals/CreateTodoModal";
import TodoItem from "../components/todo/TodoItem";
import { Checkbox, CheckboxGroup, Skeleton, Button } from "@nextui-org/react";
import DeleteTodoModal from "../components/todoModals/DeleteTodoModal";
import Snackbar from "@mui/material/Snackbar";

function TodoPage() {
  const { fetchTodos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [todos, setTodos] = useState([]);
  console.log(todos);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [error, setError] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  console.log(todos);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [isTagDropdownVisible, setIsTagDropdownVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [lastCompletedTodo, setLastCompletedTodo] = useState(null);
  const [fadingOutTodo, setFadingOutTodo] = useState(null);
  useEffect(() => {
    const getTodos = async () => {
      try {
        setLoading(true);
        const data = await fetchTodos();
        setTodos(data);
        setFilteredTodos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTodos();
  }, []);

  useEffect(() => {
    filterAndSortTodos();
  }, [todos, searchTerm, showCompleted, selectedTags]); // Add showCompleted to the dependencies

  useEffect(() => {
    if (todos.length) {
      const tags = getUniqueTags(todos);
      setAvailableTags(tags);
    }
  }, [todos]);

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
    const updatedTodos = todos.map((todo) =>
      todo._id === id ? { ...todo, completed: !todo.completed } : todo
    );

    // Immediately filter out the completed todo
    setTodos(updatedTodos);
    filterAndSortTodos();

    // Update the backend
    const updatedTodo = await updateTodo(id, {
      completed: !todos.find((todo) => todo._id === id).completed,
    });

    // Set last completed todo for potential undo
    setLastCompletedTodo(updatedTodo);

    // Show Snackbar for undo option
    showSnackbarForUndo();
  };

  const showSnackbarForUndo = () => {
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000); // Auto-hide after 3 seconds
  };

  const handleUndo = async () => {
    if (lastCompletedTodo) {
      const updatedTodo = await updateTodo(lastCompletedTodo._id, {
        completed: false,
      });

      // Revert the todo to non-completed and update the state
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === updatedTodo._id ? updatedTodo : todo
        )
      );
      setSnackbarVisible(false); // Hide snackbar after undo
    }
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

  const groupTodosByDate = (todos) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to the start of today

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0); // Set to the start of tomorrow

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    nextWeek.setHours(0, 0, 0, 0); // Set to the start of next week

    const groupedTodos = {
      Overdue: [],
      Today: [],
      Tomorrow: [],
      "This Week": [],
      Later: [],
    };

    todos.forEach((todo) => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Set to the start of the due date

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

  const getUniqueTags = (todos) => {
    const allTags = todos.flatMap((todo) => todo.tags || []);
    const uniqueTags = [...new Set(allTags.map((tag) => tag.toLowerCase()))];
    return uniqueTags;
  };

  const groupedTodos = groupTodosByDate(filteredTodos);

  return (
    <div className="p-6 w-full lg:w-2/3 md:w-full ">
      <h1 className="mb-3 text-3xl font-bold">All your Todos</h1>
      <div className="flex flex-wrap items-center mb-6 sm:w-auto space-y-2 md:space-y-0 ">
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
              <Skeleton className="flex rounded-full mb-7 w-7 h-7" />
              <div className="flex flex-col w-full gap-2">
                <Skeleton className="w-2/5 h-4 rounded-lg" />
                <Skeleton className="w-4/5 h-3 rounded-lg" />
                <Skeleton className="w-3/5 h-2 rounded-lg" />
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
                  <React.Fragment key={todo._id}>
                    <TodoItem
                      todo={todo}
                      toggleCompletion={toggleCompletion}
                      handleTaskSelection={handleTaskSelection}
                      onDelete={openWarningModal}
                      setTodos={setTodos}
                    />
                    <hr />
                  </React.Fragment>
                ))}
              </div>
            )
        )}
  </ul>
</div>


      <CreateTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTodo}
      />

      {/* Warning Confirmation Modal */}
      <DeleteTodoModal
      isOpen={isWarningModalOpen}
      onOpenChange={setIsWarningModalOpen}
      onDelete={() => handleDelete(selectedTodo._id)}
    />

      <Snackbar
        open={snackbarVisible}
        autoHideDuration={5000}
        onClose={() => setSnackbarVisible(false)}
        message="Todo marked as completed"
        action={
          <button className="px-3 py-1 bg-secondary text-accent rounded" onClick={handleUndo}>
            UNDO
          </button>
        }
      />

    </div>
  );
}

export default TodoPage;
