import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminAreas.css";

const AdminAreas = () => {
  const [search, setSearch] = useState("");
  
  const areasData = [
    { id: 1, name: "Gulberg", city: "Lahore", providers: 45, status: "Active" },
    { id: 2, name: "DHA", city: "Lahore", providers: 62, status: "Active" },
    { id: 3, name: "Model Town", city: "Lahore", providers: 38, status: "Active" },
    { id: 4, name: "Johar Town", city: "Lahore", providers: 29, status: "Active" },
    { id: 5, name: "Bahria Town", city: "Lahore", providers: 51, status: "Active" },
    { id: 6, name: "Garden Town", city: "Lahore", providers: 22, status: "Inactive" },
    { id: 7, name: "Iqbal Town", city: "Lahore", providers: 18, status: "Active" },
    { id: 8, name: "Cantt", city: "Lahore", providers: 33, status: "Active" },
  ];

  const filtered = areasData.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="areas-container">
        <div className="areas-header-section">
          <div className="title-group">
            <h1 className="page-main-heading">Location Areas</h1>
            <p className="page-sub-heading">Define and manage areas for location filtering</p>
          </div>
          <button className="btn-add-area">
            <span className="plus-sign">+</span> Add Area
          </button>
        </div>

        <div className="search-bar-wrapper">
          <div className="search-input-container">
            <span className="search-icon-svg">🔍</span>
            <input
              type="text"
              placeholder="Search areas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="table-card-main">
          <table className="lovable-styled-table">
            <thead>
              <tr>
                <th>Area Name</th>
                <th>City</th>
                <th>Providers</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((area) => (
                <tr key={area.id}>
                  <td className="area-name-text">{area.name}</td>
                  <td className="city-text">{area.city}</td>
                  <td className="providers-count">{area.providers}</td>
                  <td>
                    <span className={`status-pill-ui ${area.status.toLowerCase()}`}>
                      {area.status}
                    </span>
                  </td>
                  <td className="actions-cell-ui">
                    <button className="icon-btn edit" title="Edit">✎</button>
                    <button className="icon-btn delete" title="Delete">🗑</button>
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

export default AdminAreas;