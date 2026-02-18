import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminProviders.css";

const providersData = [
  { id: 1, name: "Ali Hassan", email: "ali@email.com", service: "Plumbing", area: "Gulberg", rating: 4.5, status: "Approved", joined: "2025-11-01" },
  { id: 2, name: "Usman Tariq", email: "usman@email.com", service: "Electrician", area: "DHA", rating: 4.8, status: "Approved", joined: "2025-10-15" },
  { id: 3, name: "Hamza Ali", email: "hamza@email.com", service: "Cleaning", area: "Model Town", rating: 4.2, status: "Pending", joined: "2026-01-20" },
  { id: 4, name: "Bilal Shah", email: "bilal@email.com", service: "AC Repair", area: "Johar Town", rating: 4.7, status: "Approved", joined: "2025-12-10" },
  { id: 5, name: "Kamran Iqbal", email: "kamran@email.com", service: "Painting", area: "Bahria Town", rating: 3.9, status: "Rejected", joined: "2026-02-05" },
];

const AdminProviders = () => {
  const [search, setSearch] = useState("");

  const filtered = providersData.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.service.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="providers-page-container">
        {/* Header Section */}
        <div className="providers-header">
          <div className="header-text">
            <h1 className="page-main-title">Manage Providers</h1>
            <p className="page-subtitle">Approve, manage, or remove service providers</p>
          </div>
          <button className="add-provider-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add Provider
          </button>
        </div>

        {/* Search Bar */}
        <div className="search-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input
            type="text"
            placeholder="Search providers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="providers-search-input"
          />
        </div>

        {/* Data Table */}
        <div className="providers-table-card">
          <table className="providers-data-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>SERVICE</th>
                <th>AREA</th>
                <th>RATING</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="table-row">
                  <td className="provider-name-cell">{p.name}</td>
                  <td>{p.email}</td>
                  <td>{p.service}</td>
                  <td>{p.area}</td>
                  <td className="rating-cell">
                    <span className="star-icon">⭐</span> {p.rating}
                  </td>
                  <td>
                    <span className={`status-tag ${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn" title="View Details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      </button>
                      <button className="approve-btn" title="Approve">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </button>
                      <button className="delete-btn" title="Delete">
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

export default AdminProviders;