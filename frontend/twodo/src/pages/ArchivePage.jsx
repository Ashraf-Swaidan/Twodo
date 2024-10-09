import React, { useEffect, useState } from "react";
import { useTodos } from "../hooks/useTodos";
import { FaPlus, FaSearch } from "react-icons/fa";
import CreateTodoModal from "../components/todoModals/CreateTodoModal";
import TodoItem from "../components/todo/TodoItem";
import { Checkbox, Skeleton, Button } from "@nextui-org/react";
import DeleteTodoModal from "../components/todoModals/DeleteTodoModal";
import Snackbar from "@mui/material/Snackbar";

function ArchivePage() {
  const { fetchTodos, updateTodo, deleteTodo } = useTodos();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [error, setError] = useState("");
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [lastUncompletedTodo, setLastUncompletedTodo] = useState(null);

  useEffect(() => {
    const getTodos = async () => {
      try {
        setLoading(true);
        const data = await fetchTodos();
        setTodos(data);
        setFilteredTodos(data.filter(todo => todo.completed)); // Show only completed todos
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getTodos();
  }, []);

  useEffect(() => {
    filterTodos();
  }, [todos, searchTerm]);

  const filterTodos = () => {
    const filtered = todos.filter((todo) => {
      const matchesSearch = todo.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return todo.completed && matchesSearch; // Show only completed todos
    });

    setFilteredTodos(filtered);
  };

  const toggleCompletion = async (id) => {
    const updatedTodos = todos.map((todo) =>
      todo._id === id ? { ...todo, completed: !todo.completed } : todo
    );

    // Immediately filter out the uncompleted todo from the list
    setTodos(updatedTodos);
    filterTodos();

    // Update the backend
    const updatedTodo = await updateTodo(id, {
      completed: !todos.find((todo) => todo._id === id).completed,
    });

    // Set last uncompleted todo for potential undo
    setLastUncompletedTodo(updatedTodo);

    // Show Snackbar for undo option
    showSnackbarForUndo();
  };

  const showSnackbarForUndo = () => {
    setSnackbarVisible(true);
    setTimeout(() => setSnackbarVisible(false), 3000); // Auto-hide after 3 seconds
  };

  const handleUndo = async () => {
    if (lastUncompletedTodo) {
      const updatedTodo = await updateTodo(lastUncompletedTodo._id, {
        completed: true, // Set back to completed
      });

      // Re-add the todo to the completed list and update the state
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


  const openWarningModal = () => {
    setIsWarningModalOpen(true);
  };

  const closeWarningModal = () => {
    setIsWarningModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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

  const groupedTodos = groupTodosByDate(filteredTodos);

  return (
    <div className="p-6 w-full lg:w-2/3 md:w-full ">
      <h1 className="mb-3 text-3xl font-bold">Completed Todos</h1>
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
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex">
        <ul className="min-w-full divide-y">
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
                            toggleCompletion={toggleCompletion} // This will mark the todo as uncompleted
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

      <DeleteTodoModal
        isOpen={isWarningModalOpen}
        onOpenChange={setIsWarningModalOpen}
        onDelete={() => handleDelete(selectedTodo._id)}
      />

      <Snackbar
        open={snackbarVisible}
        autoHideDuration={5000}
        onClose={() => setSnackbarVisible(false)}
        message="Todo uncompleted"
        action={
          <Button onClick={handleUndo} color="danger">
            Undo
          </Button>
        }
      />
    </div>
  );
}

export default ArchivePage;
