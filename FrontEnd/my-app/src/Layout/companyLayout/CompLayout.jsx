import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import {useUser} from '../../Context/Context'
import './CompLayout.css'; // Make sure this file exists

const CompLayout = () => {
  const { user } = useUser();

  return (
    <div className="layout-container">
      {/* Header */}
      <header className="header">
        <div className="logo">Company Dashboard</div>
        <nav className="nav">
          <Link to="/company-dashboard/add" className="nav-link">Add Journeys</Link>
          <Link to="/company-dashboard/all-jourenes" className="nav-link">All Journeys</Link>
          <Link to="/" className="nav-link">back home</Link>
          <span className="user-name">{user?.name || "Unknown Company"}</span>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default CompLayout;
