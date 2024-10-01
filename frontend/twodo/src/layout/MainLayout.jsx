import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  // Track the open/closed state of the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Function to toggle sidebar open/close state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // Adjust the breakpoint as needed
        setIsSidebarOpen(false); // Collapse sidebar on small screens
      } else {
        setIsSidebarOpen(true); // Expand sidebar on larger screens
      }
    };

    // Initial check
    handleResize();
    
    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex bg-primary">
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
