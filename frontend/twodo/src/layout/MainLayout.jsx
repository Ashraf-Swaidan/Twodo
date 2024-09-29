import React from 'react';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

function MainLayout() {
  return (
    <div className="flex bg-stone-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-3">
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
