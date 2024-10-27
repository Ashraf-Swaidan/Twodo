import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProjectsContext } from "../hooks/useProjects";
import { MdUnarchive } from "react-icons/md";
import {
  FaTasks,
  FaSignOutAlt,
  FaUserCircle,
  FaChevronDown,
} from "react-icons/fa";
import { BsLayoutSidebar } from "react-icons/bs";
import { useAuth } from "../context/AuthContext";
import Avatar from "@mui/material/Avatar";
import CreateProjectModal from "./todoModals/CreateProjectModal";

function Sidebar({ isOpen, toggleSidebar }) {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const { projects } = useProjectsContext();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false); // Add this state

  useEffect(() => {
    if (!isOpen) {
      setDropdownOpen(false); // Close dropdown if sidebar closes
    }
  }, [isOpen]);

  // Toggle dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when sidebar is closed
  const handleToggleSidebar = () => {
    if (isOpen) {
      setDropdownOpen(false); // Close dropdown if sidebar is closing
    }
    toggleSidebar();
  };

  const activeClass = (path) =>
    location.pathname === path ? "bg-third rounded font-bold" : "";

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full ${
          isOpen ? "w-64" : "w-0"
        } transition-all duration-300 overflow-hidden z-20`}
      >
        {/* Sidebar background when open */}
        {isOpen && (
          <div className="flex flex-col h-full p-5 bg-secondary">
            {/* Profile card section (Header now) */}
            <div className="flex items-center justify-between p-2 mb-6">
              <div
                className="flex items-center cursor-pointer"
                onClick={toggleDropdown}
              >
                {/* MUI Avatar */}
                <Avatar
                  alt={user?.username}
                  src={user?.avatar}
                  className="mr-3"
                  sx={{ width: 30, height: 30 }}
                />
                <div className="flex items-center">
                  <span className="font-semibold text-accent">
                    {user ? user.username : "User"}
                  </span>
                  <FaChevronDown
                    className="ml-2 text-xs cursor-pointer text-neutral-500"
                    onClick={toggleDropdown}
                  />
                </div>
              </div>
              {/* Toggle sidebar button */}
              <BsLayoutSidebar
                className="cursor-pointer text-accent"
                size={20}
                onClick={handleToggleSidebar}
              />
            </div>

            {/* Sidebar content */}
            <nav className="flex-1">
              <ul>
                <li className={`mb-2 ${activeClass("/todos")}`}>
                  <Link
                    to="/todos"
                    className={`flex items-center text-accent hover:bg-third py-1 px-3 rounded ${activeClass(
                      "/todos"
                    )}`}
                  >
                    <FaTasks className="mr-4" />
                    {isOpen && <span>Todos</span>}
                  </Link>
                </li>

                <li className={`mb-4 ${activeClass('/')}`}>
                  <Link
                    to="/todos/archive"
                    className={`flex items-center text-accent hover:bg-third rounded py-1 px-3 ${activeClass('/')}`}
                  >
                    <MdUnarchive  className="mr-4" />
                    {isOpen && <span>Archive</span>}
                  </Link>
                </li>

                {/* Divider */}
                <hr className="my-4 border-gray-400" />

                {/* Project Links */}
                <div>
                  <span className="font-semibold text-accent">Projects</span>
                  <ul
                    className="mt-2 overflow-y-auto"
                    style={{ maxHeight: "200px" }} // Set max height and scroll if needed
                  >
                    {projects.map((project) => (
                      <li
                        key={project._id}
                        className={`mb-2 ${activeClass(
                          `/project/${project._id}`
                        )}`}
                      >
                        <Link
                          to={`/project/${project._id}`}
                          className={`flex items-center text-accent hover:bg-third py-1 px-3 rounded ${activeClass(
                            `/project/${project._id}`
                          )}`}
                        >
                          {isOpen && <span>{project.name}</span>}
                        </Link>
                      </li>
                    ))}
                    <li className="mb-2">
                      <button
                        className="flex items-center text-accent hover:bg-third py-1 px-3 rounded"
                        onClick={() => setIsProjectModalOpen(true)} // Open the modal on click
                      >
                        {isOpen && <span>Create New Project +</span>}
                      </button>
                    </li>
                  </ul>
                </div>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute z-30 p-2 rounded shadow-xl border-1 top-16 left-5 w-53 bg-primary ">
          <div className="p-2 border-b border-neutral-400">
            <span className="font-semibold text-accent">Email</span>
            <div
              className="overflow-hidden text-sm text-accent text-ellipsis whitespace-nowrap"
              title={user ? user.email : "user@example.com"}
            >
              {user ? user.email : "user@example.com"}
            </div>
          </div>
          <ul>
            <Link to={"/profile"}>
              <li className="flex items-center p-2 rounded hover:bg-stone-100">
                <FaUserCircle className="mr-2 text-accent" />
                <span className="text-accent">Profile</span>
              </li>
            </Link>
            <li className="flex items-center p-2 rounded hover:bg-stone-100">
              <FaSignOutAlt className="mr-2 text-accent" />
              <button onClick={logout} className="text-accent">
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Floating toggle button when the sidebar is collapsed */}
      {!isOpen && (
        <div
          className="fixed z-30 cursor-pointer top-7 left-7"
          onClick={handleToggleSidebar}
        >
          <BsLayoutSidebar size={20} className="text-accent" />
        </div>
      )}

      {/* Create New Project Modal */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)} // Close modal
      />
    </>
  );
}

export default Sidebar;
