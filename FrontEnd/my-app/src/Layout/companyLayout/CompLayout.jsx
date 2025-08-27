import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useUser } from '../../Context/Context';
import {
  FaBars,
  FaPlus,
  FaList,
  FaHome,
  FaArrowLeft,
} from 'react-icons/fa';

const CompLayout = () => {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-white">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 w-64 p-5 z-20 fixed top-0 left-0 h-full transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:!translate-x-0 `}
      >
        <div className="text-2xl font-bold mb-10 sm:mt-6">Company Panel</div>
        <nav className="space-y-6">
          <Link to="/company-dashboard" className="flex items-center gap-3 hover:text-cyan-400">
            <FaHome /> Dashboard
          </Link>
          <Link to="/company-dashboard/add" className="flex items-center gap-3 hover:text-cyan-400">
            <FaPlus /> Add Journey
          </Link>
          <Link to="/company-dashboard/all-jourenes" className="flex items-center gap-3 hover:text-cyan-400">
            <FaList /> All Journeys
          </Link>
          <Link to="/" className="flex items-center gap-3 hover:text-cyan-400">
            <FaArrowLeft /> Back Home
          </Link>
        </nav>
        <div className="mt-10 text-sm font-semibold text-gray-300">
          👤 {user?.name || 'Unknown Company'}
        </div>
      </aside>

      {/* Mobile Toggle */}
      <button
        className="absolute top-4 left-4 text-2xl text-white z-30 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FaBars />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 ml-0  bg-blue-700 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default CompLayout;
