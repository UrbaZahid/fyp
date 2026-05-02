import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import API from "../../api/api";
import "./AdminBookings.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState("All");

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/bookings/admin/all");
      setBookings(data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const filtered = bookings
    .filter((b) => filter === "All" || b.status === filter)
    .filter((b) => {
      const customerName = b.customer?.name || b.customerName || "";
      const providerName = b.provider?.user?.name || "";
      const q = search.toLowerCase();
      return (
        customerName.toLowerCase().includes(q) ||
        providerName.toLowerCase().includes(q)
      );
    });

  const statusClass = (s = "") => {
    if (s === "Completed") return "status-completed";
    if (s === "Pending")   return "status-pending";
    if (s === "Accepted")  return "status-accepted";
    return "status-cancelled";
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-PK") : "—";

  return (
    <AdminLayout>
      <div className="bookings-page-wrapper">
        <div className="bookings-header-text">
          <h1 className="bookings-main-title">All Bookings</h1>
          <p className="bookings-sub-title">
            View and manage all booking histories and statuses
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bookings-filter-bar">
          <div className="bookings-search-field">
            <span className="search-icon-glass">🔍</span>
            <input
              type="text"
              placeholder="Search by customer or provider..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bookings-search-input"
            />
          </div>

          <div className="bookings-tabs">
            {["All", "Pending", "Accepted", "Completed", "Rejected"].map((f) => (
              <button
                key={f}
                className={`booking-tab-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-loading">⏳ Loading bookings...</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            background: "#fef2f2", color: "#dc2626",
            padding: "16px", borderRadius: "10px", marginBottom: "20px"
          }}>
            ❌ {error}
            <button onClick={fetchBookings} style={{
              marginLeft: "12px", padding: "4px 12px",
              background: "#dc2626", color: "white",
              border: "none", borderRadius: "6px", cursor: "pointer"
            }}>Retry</button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bookings-table-wrapper">
            {filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px",
                color: "#64748b"
              }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
                <p>No bookings found</p>
              </div>
            ) : (
              <table className="bookings-data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>CUSTOMER</th>
                    <th>PROVIDER</th>
                    <th>DATE</th>
                    <th>TIME</th>
                    <th>AMOUNT</th>
                    <th>PAID</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b._id} className="table-row">
                      <td style={{ color: "#94a3b8", fontSize: "13px" }}>
                        {i + 1}
                      </td>
                      <td>
                        <div style={{ fontWeight: "600", color: "#1e293b" }}>
                          {b.customer?.name || b.customerName || "—"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          {b.customer?.email || b.customerEmail || ""}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: "600", color: "#1e293b" }}>
                          {b.provider?.user?.name || "—"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          {b.provider?.category?.name || ""}
                        </div>
                      </td>
                      <td>{b.date || formatDate(b.createdAt)}</td>
                      <td>{b.time || "—"}</td>
                      <td style={{ fontWeight: "600" }}>
                        Rs {(b.totalAmount || 0).toLocaleString()}
                      </td>
                      <td>
                        <span style={{
                          color: b.isPaid ? "#16a34a" : "#dc2626",
                          fontWeight: "600", fontSize: "13px"
                        }}>
                          {b.isPaid ? "✅ Paid" : "❌ Unpaid"}
                        </span>
                      </td>
                      <td>
                        <span className={`booking-status-pill ${statusClass(b.status)}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Summary footer */}
        {!loading && !error && (
          <div style={{
            marginTop: "16px", color: "#64748b",
            fontSize: "13px", textAlign: "right"
          }}>
            Showing {filtered.length} of {bookings.length} bookings
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminBookings;