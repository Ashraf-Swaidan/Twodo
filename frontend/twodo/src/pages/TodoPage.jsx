import React, { useEffect, useState } from 'react'; 
import { useTodos } from '../hooks/useTodos';
import { FaPlus, FaChevronRight, FaSearch } from 'react-icons/fa';
import TodoDetailsSidebar from '../components/todo/TodoDetailsSidebar';
import CreateTodoModal from '../components/todoModals/CreateTodoModal';
import TodoItem from '../components/todo/TodoItem';
import { Checkbox } from "@nextui-org/react"; 
import { Skeleton } from '@nextui-org/react'; 
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';

function TodoPage() {
  const { fetchTodos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [error, setError] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); 

  const [loading, setLoading] = useState(true); 
  const [showCompleted, setShowCompleted] = useState(true); // State for showing completed todos

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
  }, [todos, searchTerm, showCompleted]); // Add showCompleted to the dependencies

  const filterAndSortTodos = () => {
    const filtered = todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCompletion = showCompleted || !todo.completed;
      return matchesSearch && matchesCompletion;
    });

   

    setFilteredTodos(filtered);
  };

  const toggleCompletion = async (id) => {
    setTodos((prevTodos) => 
      prevTodos.map((todo) => 
        todo._id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );

    const updatedTodo = await updateTodo(id, { completed: !todos.find(todo => todo._id === id).completed });
    setTodos((prevTodos) => 
      prevTodos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
    );
  };

  const handleTaskSelection = (todo) => {
    setSelectedTodo(todo);
  };

  const closeSidebar = () => {
    setSelectedTodo(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id); 
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      closeSidebar();
      closeWarningModal();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = async (updatedData) => {
    try {
      const updatedTodo = await updateTodo(selectedTodo._id, updatedData);
      setTodos((prevTodos) => 
        prevTodos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo))
      );
      setSelectedTodo(updatedTodo);
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
    setShowCompleted(prev => !prev);
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
        'This Week': [],
        Later: [],
    };

    todos.forEach(todo => {
        const dueDate = new Date(todo.dueDate);
        dueDate.setHours(0, 0, 0, 0); // Set to the start of the due date

        if (dueDate < today) {
            groupedTodos.Overdue.push(todo);
        } else if (dueDate.toDateString() === today.toDateString()) {
            groupedTodos.Today.push(todo);
        } else if (dueDate.toDateString() === tomorrow.toDateString()) {
            groupedTodos.Tomorrow.push(todo);
        } else if (dueDate > today && dueDate <= nextWeek) {
            groupedTodos['This Week'].push(todo);
        } else {
            groupedTodos.Later.push(todo);
        }
    });

    return groupedTodos;
};

  

  const groupedTodos = groupTodosByDate(filteredTodos);

  return (
    <div className={`p-6 relative transition-all duration-300 ${selectedTodo ? 'ml-0' : ''}`}>
      <h1 className="text-3xl mb-3 font-bold">Your Todos</h1>  
      <div className="flex items-center mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search todo..."
            className="border rounded focus:ring-1 focus:outline-none focus:ring-zinc-400 p-2 px-4 mr-2"
          />
          <FaSearch />
        </div>
       
        <label className="ml-4 flex items-center">
          
           <Checkbox
            radius='full'
            isSelected={showCompleted}
            onChange={toggleShowCompleted}
            color="default" 
            size="lg" 
            css={{ margin: 0 }}
          />
          Show Completed
        </label>
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <div className={`flex transition-all duration-300`}>
        <ul className={`divide-y transition-all duration-300 ${selectedTodo ? 'w-2/3' : 'w-2/3'}`}>
          <li onClick={() => setIsModalOpen(true)}  className="cursor-pointer hover:bg-slate-50 p-3 px-5 rounded flex justify-start items-center border border-neutral-200">
            <span><FaPlus size={15} className="mr-2 " /></span>
            <span className="font-semibold">Add new task</span>
          </li>

          {/* Render skeletons while loading */}
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <li key={index} className="mb-2 p-3">
                <div className="max-w-[300px] w-full flex items-center gap-3">
                  <div>
                    <Skeleton className="flex mb-7 rounded-full w-7 h-7"/>
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <Skeleton className="h-4 w-2/5 rounded-lg"/>
                    <Skeleton className="h-3 w-4/5 rounded-lg"/>
                    <Skeleton className="h-2 w-3/5 rounded-lg"/>
                  </div>
                </div>
              </li>
            ))
          ) : (
            Object.entries(groupedTodos).map(([dateLabel, todos]) => (
              todos.length > 0 && (
                <div key={dateLabel}>
                  <h2 className="text-lg font-bold mt-4">{dateLabel}</h2>
                  {todos.map(todo => (
                    <TodoItem 
                      key={todo._id} 
                      todo={todo} 
                      toggleCompletion={toggleCompletion} 
                      handleTaskSelection={handleTaskSelection} 
                      onDelete={openWarningModal} 
                    />
                  ))}
                </div>
              )
            ))
          )}
        </ul>

        <TodoDetailsSidebar 
          todo={selectedTodo} 
          onClose={closeSidebar} 
          onDelete={openWarningModal} 
          onEdit={handleEdit} 
        />
      </div>

      <CreateTodoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTodo}
      />

      {/* Warning Confirmation Modal */}
      <Dialog
        open={isWarningModalOpen}
        onClose={closeWarningModal}
        aria-labelledby="delete-confirmation-dialog"
      >
        <DialogContent>
          <p>Are you sure you want to delete this todo?</p>
        </DialogContent>
        <DialogActions>
          <button onClick={closeWarningModal} className='px-2 py-1 bg-accent text-white rounded hover:bg-slate-600' >
            Cancel
          </button>
          <button 
            onClick={() => handleDelete(selectedTodo._id)} 
            className='mr-2 px-2 py-1 bg-danger text-white hover:bg-red-400 rounded'
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default TodoPage;
