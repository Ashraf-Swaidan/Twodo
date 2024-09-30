import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaHome, FaTasks, FaSignOutAlt, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen, toggleSidebar }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Dropdown state

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const activeClass = (path) =>
    location.pathname === path ? 'bg-stone-200 rounded-lg font-bold' : '';

  return (
    <div
      className={`fixed top-7 left-7 h-[92vh] rounded-xl ${
        isOpen ? 'w-64' : 'w-20'
      } bg-stone-100 p-5 flex flex-col transition-width duration-300`}
    >
      {/* Sidebar toggle button */}
      <div className="flex items-center justify-between mb-6 p-2">
        <FaBars className="text-neutral-700 cursor-pointer" size={20} onClick={toggleSidebar} />
      </div>

      <nav className="flex-1">
        <ul>
          <li className={`mb-2 ${activeClass('/')}`}>
            <Link
              to="/"
              className={`flex items-center text-neutral-700 hover:bg-stone-200 rounded-lg py-1 px-3 ${activeClass(
                '/'
              )}`}
            >
              <FaHome className={isOpen && 'mr-4'} />
              {isOpen && <span>Home</span>}
              {!isOpen && <span className="sr-only">Home</span>}
            </Link>
          </li>
          <li className={`mb-4 ${activeClass('/todos')}`}>
            <Link
              to="/todos"
              className={`flex items-center text-neutral-700 hover:bg-stone-200 py-1 px-3 rounded-full ${activeClass(
                '/todos'
              )}`}
            >
              <FaTasks className={isOpen && 'mr-4'} />
              {isOpen && <span>Todos</span>}
              {!isOpen && <span className="sr-only">Todos</span>}
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile card section */}
      <div className="mt-auto relative">
        <div
          className="flex items-center justify-between cursor-pointer text-neutral-700 hover:bg-stone-200 p-1 rounded-lg"
          onClick={toggleDropdown}
        >
            <div className='flex flex-row items-center'>
            <FaUserCircle className="text-neutral-700 mr-2" size={30} />
            {isOpen && <span>{user ? user.username : 'User'}</span>}
            </div>

            <div>
               {isOpen && (      
                <FaChevronDown className="ml-2" />
            )}
            </div>

        </div>

        {/* Dropdown menu for Logout */}
        {isDropdownOpen && (
          <div className="absolute bottom-12 right-0 w-2/3 bg-neutral-50  rounded-lg z-10">
            <button
              onClick={logout}
              className="flex items-center text-neutral-700 hover:bg-stone-200 p-1 px-2 rounded-lg w-full"
            >
              <FaSignOutAlt className="mx-2" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
