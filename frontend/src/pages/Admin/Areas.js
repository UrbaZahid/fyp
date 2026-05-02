import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import API from "../../api/api";
import "./AdminAreas.css";

const AdminAreas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentArea, setCurrentArea] = useState(null);
  const [form, setForm] = useState({ name: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Fetch areas
  const fetchAreas = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/admin/areas");
      setAreas(data.areas || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load areas. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  // Open Add
  const openAdd = () => {
    setEditMode(false);
    setCurrentArea(null);
    setForm({ name: "", city: "" });
    setFormError("");
    setShowModal(true);
  };

  // Open Edit
  const openEdit = (area) => {
    setEditMode(true);
    setCurrentArea(area);
    setForm({ name: area.name, city: area.city || "" });
    setFormError("");
    setShowModal(true);
  };

  // Save
  const handleSave = async () => {
    if (!form.name.trim()) {
      setFormError("Area name is required.");
      return;
    }
    if (!form.city.trim()) {
      setFormError("City is required.");
      return;
    }

    setSaving(true);
    setFormError("");

    try {
      if (editMode) {
        await API.put(`/areas/${currentArea._id}`, form);
      } else {
        await API.post("/areas", form);
      }

      setShowModal(false);
      fetchAreas();
    } catch (err) {
      setFormError(err.response?.data?.message || "Save failed. Try again.");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete area "${name}"? This cannot be undone.`)) return;

    try {
      await API.delete(`/areas/${id}`);
      setAreas(areas.filter((a) => a._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed.");
    }
  };

  const filtered = areas.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.city || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="areas-container">
        <div className="areas-header-section">
          <div className="title-group">
            <h1 className="page-main-heading">Location Areas</h1>
            <p className="page-sub-heading">
              Define and manage areas for location filtering
            </p>
          </div>

          <button className="btn-add-area" onClick={openAdd}>
            <span className="plus-sign">+</span> Add Area
          </button>
        </div>

        {/* Search */}
        <div className="search-bar-wrapper">
          <div className="search-input-container">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search areas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-loading">⏳ Loading areas...</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="error-box">
            ❌ {error}
            <button onClick={fetchAreas}>Retry</button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="table-card-main">
            <table className="lovable-styled-table">
              <thead>
                <tr>
                  <th>Area Name</th>
                  <th>City</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty">
                      No areas found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((area) => (
                    <tr key={area._id}>
                      <td>{area.name}</td>
                      <td>{area.city || "—"}</td>

                      <td>
                        <span
                          className={`status-pill-ui ${
                            area.isActive ? "active" : "inactive"
                          }`}
                        >
                          {area.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="actions-cell-ui">
                          <button
                            className="icon-btn edit"
                            onClick={() => openEdit(area)}
                          >
                            ✎
                          </button>

                          <button
                            className="icon-btn delete"
                            onClick={() => handleDelete(area._id, area.name)}
                          >
                            🗑
                          </button>
                    </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>
              {editMode ? "✎ Edit Area" : "+ Add New Area"}
            </h2>

            {formError && <div className="form-error">{formError}</div>}

            <input
              type="text"
              placeholder="Area Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="City"
              value={form.city}
              onChange={(e) =>
                setForm({ ...form, city: e.target.value })
              }
            />

            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>

              <button onClick={handleSave} disabled={saving}>
                {saving
                  ? "Saving..."
                  : editMode
                  ? "Update Area"
                  : "Add Area"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminAreas;