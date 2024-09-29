import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaHome, FaTasks, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const { logout, user } = useAuth();
  const location = useLocation(); // To get the current route

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const activeClass = (path) => location.pathname === path ? 'bg-stone-200 rounded-lg font-bold ' : '';

  return (
    <div className={`flex m-7 mr-0 rounded-xl ${isOpen ? 'w-64' : 'w-20'} bg-stone-100 h-screen p-5 flex-col transition-width duration-300`}>
      <div className="flex items-center justify-between mb-6 p-2">
        <FaBars className="text-neutral-700 cursor-pointer" size={20} onClick={toggleSidebar} />
        {isOpen && (
          <div className="flex items-center">
            <FaUserCircle className="text-neutral-700 mr-2" size={24} />
            <span className="text-white">{user ? user.name : 'User'}</span>
          </div>
        )}
      </div>
      <nav className="flex-1">
        <ul>
          <li className={`mb-2 ${activeClass('/')}`}>
            <Link to="/" className={`flex items-center text-neutral-700  hover:bg-stone-200 rounded-lg py-1 px-3 ${activeClass('/')}`}>
              <FaHome className={isOpen && 'mr-4'} />
              {isOpen && <span>Home</span>}
              {!isOpen && <span className="sr-only">Home</span>} {/* Screen reader for accessibility */}
            </Link>
          </li>
          <li className={`mb-4 ${activeClass('/todos')}`}>
            <Link to="/todos" className={`flex items-center text-neutral-700  hover:bg-stone-200 py-1 px-3 rounded-full ${activeClass('/todos')}`}>
              <FaTasks className={isOpen && 'mr-4'} />
              {isOpen && <span>Todos</span>}
              {!isOpen && <span className="sr-only">Todos</span>}
            </Link>
          </li>
        </ul>
      </nav>
      <div className="mt-auto">
        <button
          onClick={logout}
          className="flex items-center text-neutral-700 text-lg hover:bg-stone-200 p-2 rounded-full w-full"
        >
          <FaSignOutAlt className={isOpen && 'mr-2'} />
          {isOpen && <span>Logout</span>}
          {!isOpen && <span className="sr-only">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
