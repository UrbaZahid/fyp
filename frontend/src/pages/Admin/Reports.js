import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import API from "../../api/api";
import "./AdminReports.css";

const AdminReports = () => {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/admin/reports");
      setData(res.data);
    } catch (err) {
      setError("Reports load nahi ho sake.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  if (loading) return <AdminLayout><div className="admin-loading" style={{ padding: "80px", textAlign: "center" }}>⏳ Loading reports...</div></AdminLayout>;

  if (error) return (
    <AdminLayout>
      <div style={{ background: "#fef2f2", color: "#dc2626", padding: "20px", borderRadius: "10px", margin: "40px" }}>
        ❌ {error}
        <button onClick={fetchReports} style={{ marginLeft: "12px", padding: "6px 14px", background: "#dc2626", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>Retry</button>
      </div>
    </AdminLayout>
  );

  const { bookingSummary = {}, revenue = {}, categoryStats = [] } = data || {};
  const total = bookingSummary.total || 1; // avoid divide by zero

  const completedPct  = Math.round(((bookingSummary.completed  || 0) / total) * 100);
  const pendingPct    = Math.round(((bookingSummary.pending    || 0) / total) * 100);
  const rejectedPct   = Math.round(((bookingSummary.rejected   || 0) / total) * 100);

  // Max category count for bar width scaling
  const maxCat = categoryStats.length > 0 ? Math.max(...categoryStats.map(c => c.count)) : 1;

  return (
    <AdminLayout>
      <div className="reports-container">
        <div className="reports-header">
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Platform performance, revenue stats, and booking insights</p>
        </div>

        {/* Stat Cards */}
        <div className="stats-row">
          {[
            { label: "Total Revenue",       val: `Rs ${(revenue.total || 0).toLocaleString()}`, color: "orange", icon: "💰" },
            { label: "Completed Bookings",  val: bookingSummary.completed || 0,                  color: "green",  icon: "✅" },
            { label: "Pending Bookings",    val: bookingSummary.pending   || 0,                  color: "yellow", icon: "⏳" },
            { label: "Total Bookings",      val: bookingSummary.total     || 0,                  color: "blue",   icon: "📋" },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-info">
                <span className="stat-label">{s.label}</span>
                <h2 className="stat-value">{s.val}</h2>
              </div>
              <div className={`stat-icon box-${s.color}`}>{s.icon}</div>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          {/* Top Booked Services */}
          <div className="chart-card">
            <h3 className="chart-title">Top Booked Services</h3>
            {categoryStats.length === 0 ? (
              <p style={{ color: "#64748b", fontSize: "14px", padding: "20px 0" }}>
                Abhi koi booking data nahi hai.
              </p>
            ) : (
              <div className="h-bar-container">
                {categoryStats.map((item, idx) => (
                  <div key={idx} className="h-bar-row">
                    <span className="h-label">{item._id || "Unknown"}</span>
                    <div className="h-track">
                      <div className="h-fill" style={{ width: `${Math.round((item.count / maxCat) * 100)}%` }}></div>
                    </div>
                    <span className="h-val">{item.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking Status Summary */}
          <div className="chart-card">
            <h3 className="chart-title">Booking Status Summary</h3>
            <div className="donut-wrapper">
              <svg viewBox="0 0 36 36" className="donut-svg">
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#22c55e" strokeWidth="3.8"
                  strokeDasharray={`${completedPct} ${100 - completedPct}`} strokeDashoffset="25" />
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f59e0b" strokeWidth="3.8"
                  strokeDasharray={`${pendingPct} ${100 - pendingPct}`} strokeDashoffset={`${-(completedPct)}`} />
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#ef4444" strokeWidth="3.8"
                  strokeDasharray={`${rejectedPct} ${100 - rejectedPct}`} strokeDashoffset={`${-(completedPct + pendingPct)}`} />
              </svg>
            </div>
            <div className="legend">
              <div className="leg-item"><span className="dot g"></span> Completed: {bookingSummary.completed || 0} ({completedPct}%)</div>
              <div className="leg-item"><span className="dot y"></span> Pending: {bookingSummary.pending || 0} ({pendingPct}%)</div>
              <div className="leg-item"><span className="dot r"></span> Rejected: {bookingSummary.rejected || 0} ({rejectedPct}%)</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;