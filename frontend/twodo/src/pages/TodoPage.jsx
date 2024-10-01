import React, { useEffect, useState } from 'react'; 
import { useTodos } from '../hooks/useTodos';
import { FaPlus, FaChevronRight, FaSearch } from 'react-icons/fa';
import TodoDetailsSidebar from '../components/todo/TodoDetailsSidebar';
import CreateTodoModal from '../components/todoModals/CreateTodoModal';
import TodoItem from '../components/todo/TodoItem';


function TodoPage() {
  const { fetchTodos, addTodo, updateTodo, deleteTodo } = useTodos();
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [error, setError] = useState('');
  const [selectedTodo, setSelectedTodo] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [sortOrder, setSortOrder] = useState('asc'); // State for sorting order

  useEffect(() => {
    const getTodos = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
        setFilteredTodos(data); // Initialize filteredTodos
      } catch (err) {
        setError(err.message);
      }
    };

    getTodos();
  }, []);

  useEffect(() => {
    filterAndSortTodos();
  }, [todos, searchTerm, sortOrder]);

  // Filter and sort todos based on the search term and sorting order
  const filterAndSortTodos = () => {
    const filtered = todos.filter(todo =>
      todo.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredTodos(sorted);
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

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

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
        <select onChange={handleSortChange} value={sortOrder} className="ml-4 text-stone-400 p-2">
          <option value="asc">Sort by Date (Asc)</option>
          <option value="desc">Sort by Date (Desc)</option>
        </select>
      </div>
      {error && <p className="text-red-500">{error}</p>}

      <div className={`flex transition-all duration-300`}>
      <ul className={`divide-y transition-all duration-300 ${selectedTodo ? 'w-2/3' : 'w-2/3'}`}>

        <li className="p-3 px-5 rounded flex justify-start items-center border border-neutral-200">
          <span><FaPlus size={15} onClick={() => setIsModalOpen(true)} className="mr-2 cursor-pointer" /></span>
          <span className="font-semibold">Add new task</span>
        </li>
  
        {filteredTodos.map((todo) => (
            <TodoItem 
            key={todo._id} 
            todo={todo} 
            toggleCompletion={toggleCompletion} 
            handleTaskSelection={handleTaskSelection} 
          />
        ))}
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

      {isWarningModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to delete this todo?</h2>
            <div className="flex justify-end">
              <button onClick={closeWarningModal} className="mr-2 text-gray-500">Cancel</button>
              <button onClick={() => handleDelete(selectedTodo._id)} className="bg-red-600 text-white py-2 px-4 rounded-full">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoPage;
