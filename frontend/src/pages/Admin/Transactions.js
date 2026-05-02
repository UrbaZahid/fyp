// src/pages/Admin/Transactions.js
// ✅ FULLY INTEGRATED — real backend data from /api/admin/transactions

import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/AdminLayout";
import API from "../../api/api";
import "./AdminTransactions.css";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [search, setSearch]             = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await API.get("/admin/transactions");
      setTransactions(data.transactions || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load transactions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  const filtered = transactions.filter((t) => {
    const customer = t.customer?.name || "";
    const q = search.toLowerCase();
    return customer.toLowerCase().includes(q);
  });

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const methodLabel = (m) => {
    if (m === "card")           return "💳 Card";
    if (m === "mobile_wallet")  return "📱 Mobile Wallet";
    if (m === "net_banking")    return "🏦 Net Banking";
    return m || "—";
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-PK", {
      year: "numeric", month: "short", day: "numeric"
    }) : "—";

  return (
    <AdminLayout>
      <div className="txn-page-container">
        <div className="txn-header">
          <div className="header-text">
            <h1 className="page-main-title">Payment Transactions</h1>
            <p className="page-subtitle">
              Monitor all payment transactions for transparency
            </p>
          </div>

          {/* Total Revenue Badge */}
          <div style={{
            background: "#f0fdf4", border: "1px solid #bbf7d0",
            borderRadius: "10px", padding: "12px 20px", textAlign: "right"
          }}>
            <div style={{ fontSize: "12px", color: "#16a34a", fontWeight: "600" }}>
              Total Revenue
            </div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#15803d" }}>
              Rs {totalRevenue.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="search-wrapper" style={{ marginBottom: "20px" }}>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute", left: "12px", top: "50%",
              transform: "translateY(-50%)", color: "#94a3b8"
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search by customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: "38px", padding: "10px 14px 10px 38px",
                border: "1px solid #e2e8f0", borderRadius: "8px",
                width: "320px", fontSize: "14px", outline: "none"
              }}
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="admin-loading">⏳ Loading transactions...</div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{
            background: "#fef2f2", color: "#dc2626",
            padding: "16px", borderRadius: "10px", marginBottom: "20px"
          }}>
            ❌ {error}
            <button onClick={fetchTransactions} style={{
              marginLeft: "12px", padding: "4px 12px",
              background: "#dc2626", color: "white",
              border: "none", borderRadius: "6px", cursor: "pointer"
            }}>Retry</button>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="txn-table-wrapper">
            {filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px", color: "#64748b"
              }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>💳</div>
                <p>No transactions found</p>
              </div>
            ) : (
              <table className="txn-data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>CUSTOMER</th>
                    <th>AMOUNT</th>
                    <th>METHOD</th>
                    <th>STATUS</th>
                    <th>DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((t, i) => (
                    <tr key={t._id} className="txn-row">
                      <td style={{ color: "#94a3b8", fontSize: "13px" }}>
                        {i + 1}
                      </td>
                      <td>
                        <div style={{ fontWeight: "600", color: "#1e293b" }}>
                          {t.customer?.name || "—"}
                        </div>
                        <div style={{ fontSize: "12px", color: "#64748b" }}>
                          {t.customer?.email || ""}
                        </div>
                      </td>
                      <td style={{ fontWeight: "700", color: "#1e293b" }}>
                        Rs {(t.amount || 0).toLocaleString()}
                      </td>
                      <td>{methodLabel(t.method)}</td>
                      <td>
                        <span style={{
                          background: t.status === "completed" ? "#dcfce7" : "#fef9c3",
                          color: t.status === "completed" ? "#16a34a" : "#a16207",
                          padding: "3px 10px", borderRadius: "20px",
                          fontSize: "12px", fontWeight: "600"
                        }}>
                          {t.status === "completed" ? "✅ Completed" : t.status}
                        </span>
                      </td>
                      <td style={{ color: "#64748b", fontSize: "13px" }}>
                        {formatDate(t.paidAt || t.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {!loading && !error && (
          <div style={{
            marginTop: "12px", color: "#64748b",
            fontSize: "13px", textAlign: "right"
          }}>
            {filtered.length} transaction(s)
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;