import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminUsers.css";

const usersData = [
  { id: 1, name: "Ayesha Khan", email: "ayesha@email.com", phone: "0301-1234567", area: "Gulberg", status: "Active", joined: "2025-12-01" },
  { id: 2, name: "Sara Ahmed", email: "sara@email.com", phone: "0312-2345678", area: "DHA", status: "Active", joined: "2025-11-15" },
  { id: 3, name: "Fatima Noor", email: "fatima@email.com", phone: "0333-3456789", area: "Model Town", status: "Blocked", joined: "2025-10-20" },
  { id: 4, name: "Zainab Raza", email: "zainab@email.com", phone: "0345-4567890", area: "Johar Town", status: "Active", joined: "2026-01-10" },
  { id: 5, name: "Hira Malik", email: "hira@email.com", phone: "0300-5678901", area: "Bahria Town", status: "Active", joined: "2026-02-01" },
];

const AdminUsers = () => {
  const [search, setSearch] = useState("");

  const filtered = usersData.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="users-page-container">
        {/* Header Section */}
        <div className="users-header">
          <div className="header-text">
            <h1 className="page-main-title">Manage Users</h1>
            <p className="page-subtitle">Add, view, or remove platform users</p>
          </div>
          <button className="add-user-btn">
            {/* Plus Icon SVG */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add User
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-wrapper">
          {/* Search Icon SVG */}
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="users-search-input"
          />
        </div>

        {/* Data Table */}
        <div className="users-table-card">
          <table className="users-data-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>PHONE</th>
                <th>AREA</th>
                <th>STATUS</th>
                <th>JOINED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="table-row">
                  <td className="user-name-cell">{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.area}</td>
                  <td>
                    <span className={`status-tag ${u.status.toLowerCase()}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="joined-date">{u.joined}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn" title="View Details">
                        {/* Eye Icon SVG */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <button className="delete-btn" title="Delete User">
                        {/* Trash Icon SVG */}
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;