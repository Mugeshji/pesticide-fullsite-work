import React from "react";
import { Link } from "react-router-dom";
import "./Admin.css";  // Only our CSS now

function Admin() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <nav className="admin-navbar">
          <a className="admin-brand" href="#">
            ⚡ Admin Pages
          </a>

          <ul className="admin-menu">
            <li>
              <Link to="/user" className="admin-link">All Users</Link>
            </li>
            <li>
              <Link to="/products" className="admin-link">Products</Link>
            </li>
          </ul>
        </nav>
      </header>

      <div className="admin-content">
        <h1>Welcome, Admin 👋</h1>
        <p>Use the navbar to manage users and products.</p>
      </div>
    </div>
  );
}

export default Admin;
