import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  // Track the open/closed state of the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // Track if the screen is small

  // Function to toggle sidebar open/close state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Effect to handle window resizing
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSmallScreen(true);
        setIsSidebarOpen(false); // Collapse sidebar on small screens
      } else {
        setIsSmallScreen(false); // Mark it as not small, but don't auto-open the sidebar
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

      {/* Main Content with Overlay */}
      <div
        className={`relative flex-1  overflow-auto h-screen transition-all duration-300 ${
          isSmallScreen
            ? 'ml-8' // Small margin for small screens
            : isSidebarOpen
            ? 'ml-72' // Full margin when sidebar is open
            : 'ml-24' // Smaller margin when sidebar is closed
        }`}
      >
        {/* Dark overlay when sidebar is open on small screens */}
        {isSmallScreen && isSidebarOpen && (
          <div
            onClick={toggleSidebar} // Close the sidebar if the overlay is clicked
            className="fixed inset-0 bg-black opacity-50 z-10"
          ></div>
        )}

        {/* Outlet content */}
        <div className={`relative z-200 ${isSmallScreen && isSidebarOpen ? 'pointer-events-none' : ''}`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
