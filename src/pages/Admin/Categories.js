import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminCategories.css";

const initialCategories = [
  { id: 1, name: "Plumbing", services: 12, icon: "🔧", status: "Active" },
  { id: 2, name: "Electrician", services: 18, icon: "⚡", status: "Active" },
  { id: 3, name: "Cleaning", services: 15, icon: "🧹", status: "Active" },
  { id: 4, name: "AC Repair", services: 8, icon: "❄️", status: "Active" },
  { id: 5, name: "Painting", services: 10, icon: "🎨", status: "Active" },
  { id: 6, name: "Carpentry", services: 7, icon: "🪚", status: "Inactive" },
  { id: 7, name: "Pest Control", services: 5, icon: "🐛", status: "Active" },
  { id: 8, name: "Gardening", services: 6, icon: "🌱", status: "Active" },
];

const AdminCategories = () => {
  const [categories] = useState(initialCategories);

  return (
    <AdminLayout>
      <div className="cat-page-container">
        {/* Header Section */}
        <div className="cat-header-row">
          <div>
            <h1 className="cat-main-title">Service Categories</h1>
            <p className="cat-sub-title">Add, update, or delete service categories</p>
          </div>
          <button className="cat-add-btn">
            <span className="plus-icon">+</span> Add Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="categories-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="category-card group">
              <div className="card-top-flex">
                <div className="cat-icon-display">{cat.icon}</div>
                <div className="cat-action-group">
                  <button className="cat-edit-icon" title="Edit">✎</button>
                  <button className="cat-delete-icon" title="Delete">🗑</button>
                </div>
              </div>
              
              <div className="card-details">
                <h3 className="cat-name-heading">{cat.name}</h3>
                <p className="cat-service-count">{cat.services} services</p>
                <div className={`cat-status-badge ${cat.status.toLowerCase()}`}>
                  {cat.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;