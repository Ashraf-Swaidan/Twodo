import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  // Track the open/closed state of the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to toggle sidebar open/close state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-stone-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div
        className={`flex-1 p-3 overflow-auto h-screen transition-all duration-300 ${
          isSidebarOpen ? 'ml-72' : 'ml-24'
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
