import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTasks, FaSignOutAlt, FaUserCircle, FaChevronDown } from 'react-icons/fa';
import { BsLayoutSidebar } from "react-icons/bs";
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
    location.pathname === path ? 'bg-third rounded-lg font-bold' : '';

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full ${
          isOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 overflow-hidden z-20`}
      >
        {/* Sidebar background when open */}
        {isOpen && (
          <div className="h-full bg-secondary p-5 flex flex-col">
            {/* Profile card section (Header now) */}
            <div className="flex items-center justify-between mb-6 p-2">
              <div className="flex items-center cursor-pointer" onClick={toggleDropdown}>
                {/* Placeholder Image */}
                <img
                  src="/01.jpg"
                  alt="User"
                  className="rounded-full mr-2 w-8"
                />
                <div className="flex items-center">
                  <span className="font-semibold text-accent">{user ? user.username : 'User'}</span>
                  <FaChevronDown className="ml-1 text-accent cursor-pointer" onClick={toggleDropdown} />
                </div>
              </div>
              {/* Toggle sidebar button */}
              <BsLayoutSidebar
                className="text-accent cursor-pointer"
                size={20}
                onClick={toggleSidebar}
              />
            </div>

            {/* Sidebar content */}
            <nav className="flex-1">
              <ul>
                <li className={`mb-2 ${activeClass('/')}`}>
                  <Link
                    to="/"
                    className={`flex items-center text-accent hover:bg-third rounded-lg py-1 px-3 ${activeClass(
                      '/'
                    )}`}
                  >
                    <FaHome className="mr-4" />
                    {isOpen && <span>Home</span>}
                  </Link>
                </li>
                <li className={`mb-4 ${activeClass('/todos')}`}>
                  <Link
                    to="/todos"
                    className={`flex items-center text-accent hover:bg-third py-1 px-3 rounded-full ${activeClass(
                      '/todos'
                    )}`}
                  >
                    <FaTasks className="mr-4" />
                    {isOpen && <span>Todos</span>}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute top-16 left-5 w-53 bg-primary border-accent shadow-xl rounded-lg p-2 z-30">
          <div className="p-2 border-b border-neutral-400">
            <span className="text-accent font-semibold">Email</span>
            <div className="text-sm text-accent overflow-hidden text-ellipsis whitespace-nowrap" title={user ? user.email : 'user@example.com'}>
              {user ? user.email : 'user@example.com'}
            </div>
          </div>
          <ul>
            <li className="flex items-center p-2 hover:bg-stone-100 rounded">
              <FaUserCircle className="mr-2 text-accent" />
              <span className="text-accent">Profile</span>
            </li>
            <li className="flex items-center p-2 hover:bg-stone-100 rounded">
              <FaSignOutAlt className="mr-2 text-accent" />
              <button onClick={logout} className="text-accent">Logout</button>
            </li>
          </ul>
        </div>
      )}

      {/* Floating toggle button when the sidebar is collapsed */}
      {!isOpen && (
        <div
          className="fixed top-7 left-7 cursor-pointer z-30"
          onClick={toggleSidebar}
        >
          <BsLayoutSidebar size={20} className="text-accent" />
        </div>
      )}
    </>
  );
}

export default Sidebar;
