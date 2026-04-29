// src/pages/Admin/Categories.js
// ✅ FULLY INTEGRATED — real backend CRUD via /api/categories

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import API from "../../api/api";
import "./AdminCategories.css";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [showModal, setShowModal]   = useState(false);
  const [editingCat, setEditingCat] = useState(null); // null = add new
  const [form, setForm]             = useState({ name: "", icon: "🔧", description: "" });
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState("");

  const fetchCategories = async () => {
    try {
      setLoading(true);
      // Admin gets all categories (including inactive) — use admin endpoint if available,
      // otherwise use public endpoint
      const { data } = await API.get("/categories");
      setCategories(data.categories || []);
    } catch (err) {
      setError("Categories load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => {
    setEditingCat(null);
    setForm({ name: "", icon: "🔧", description: "" });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditingCat(cat);
    setForm({ name: cat.name, icon: cat.icon || "🔧", description: cat.description || "" });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setFormError("Category name required.");
      return;
    }
    try {
      setSaving(true);
      setFormError("");
      if (editingCat) {
        await API.put(`/categories/${editingCat._id}`, form);
      } else {
        await API.post("/categories", form);
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Is category ko delete karna chahte hain?")) return;
    try {
      await API.delete(`/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const emojiOptions = ["🔧", "⚡", "🧹", "❄️", "🎨", "🪚", "🐛", "🌱", "🚿", "🏠", "🔌", "🛠️", "🚪", "💡", "🪣"];

  return (
    <AdminLayout>
      <div className="cat-page-container">
        {/* Header */}
        <div className="cat-header-row">
          <div>
            <h1 className="cat-main-title">Service Categories</h1>
            <p className="cat-sub-title">Add, update, or delete service categories</p>
          </div>
          <button className="cat-add-btn" onClick={openAdd}>
            <span className="plus-icon">+</span> Add Category
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-loading">⏳ Loading categories...</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            background: "#fef2f2", color: "#dc2626",
            padding: "16px", borderRadius: "10px", marginBottom: "20px"
          }}>
            ❌ {error}
          </div>
        )}

        {/* Categories Grid */}
        {!loading && !error && (
          <>
            {categories.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px", color: "#64748b"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "12px" }}>📂</div>
                <p>Koi category nahi hai. Pehli category add karo!</p>
              </div>
            ) : (
              <div className="categories-grid">
                {categories.map((cat) => (
                  <div key={cat._id} className="category-card group">
                    <div className="card-top-flex">
                      <div className="cat-icon-display">{cat.icon || "🔧"}</div>
                      <div className="cat-action-group">
                        <button
                          className="cat-edit-icon"
                          title="Edit"
                          onClick={() => openEdit(cat)}
                        >✎</button>
                        <button
                          className="cat-delete-icon"
                          title="Delete"
                          onClick={() => handleDelete(cat._id)}
                        >🗑</button>
                      </div>
                    </div>
                    <div className="card-details">
                      <h3 className="cat-name-heading">{cat.name}</h3>
                      {cat.description && (
                        <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px" }}>
                          {cat.description}
                        </p>
                      )}
                      <span style={{
                        background: cat.isActive ? "#dcfce7" : "#fee2e2",
                        color: cat.isActive ? "#16a34a" : "#dc2626",
                        padding: "2px 10px", borderRadius: "20px",
                        fontSize: "12px", fontWeight: "600"
                      }}>
                        {cat.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Modal ────────────────────────────────────────── */}
      {showModal && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "white", borderRadius: "16px",
            padding: "32px", width: "440px", boxShadow: "0 20px 60px rgba(0,0,0,0.2)"
          }}>
            <h3 style={{ margin: "0 0 20px", color: "#1e293b", fontSize: "18px", fontWeight: "700" }}>
              {editingCat ? "Edit Category" : "Add New Category"}
            </h3>

            {formError && (
              <div style={{
                background: "#fef2f2", color: "#dc2626",
                padding: "10px 14px", borderRadius: "8px", marginBottom: "16px",
                fontSize: "14px"
              }}>
                {formError}
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Category Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Electrician"
                style={{
                  width: "100%", padding: "10px 14px",
                  border: "1px solid #d1d5db", borderRadius: "8px",
                  fontSize: "14px", outline: "none", boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Icon (Emoji)
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
                {emojiOptions.map((e) => (
                  <button
                    key={e}
                    onClick={() => setForm({ ...form, icon: e })}
                    style={{
                      fontSize: "22px", padding: "6px 10px",
                      border: form.icon === e ? "2px solid #3b82f6" : "2px solid #e2e8f0",
                      borderRadius: "8px", background: form.icon === e ? "#eff6ff" : "white",
                      cursor: "pointer"
                    }}
                  >{e}</button>
                ))}
              </div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Selected: <span style={{ fontSize: "20px" }}>{form.icon}</span>
              </div>
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Description (Optional)
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief description..."
                rows={2}
                style={{
                  width: "100%", padding: "10px 14px",
                  border: "1px solid #d1d5db", borderRadius: "8px",
                  fontSize: "14px", outline: "none", resize: "vertical",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "10px 20px", border: "1px solid #d1d5db",
                  borderRadius: "8px", background: "white",
                  cursor: "pointer", fontSize: "14px"
                }}
              >Cancel</button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "10px 20px", background: saving ? "#93c5fd" : "#3b82f6",
                  color: "white", border: "none", borderRadius: "8px",
                  cursor: saving ? "not-allowed" : "pointer",
                  fontSize: "14px", fontWeight: "600"
                }}
              >
                {saving ? "Saving..." : editingCat ? "Update" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCategories;