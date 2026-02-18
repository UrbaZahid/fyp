import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminTransactions.css";

const transactionsData = [
  { id: "TXN-001", booking: "BK-001", customer: "Ayesha Khan", provider: "Ali Hassan", amount: "Rs 2,500", method: "JazzCash", status: "Completed", date: "2026-02-13" },
  { id: "TXN-002", booking: "BK-002", customer: "Sara Ahmed", provider: "Usman Tariq", amount: "Rs 3,000", method: "Easypaisa", status: "Pending", date: "2026-02-14" },
  { id: "TXN-003", booking: "BK-004", customer: "Zainab Raza", provider: "Bilal Shah", amount: "Rs 4,500", method: "Bank Transfer", status: "Completed", date: "2026-02-14" },
  { id: "TXN-004", booking: "BK-005", customer: "Hira Malik", provider: "Kamran Iqbal", amount: "Rs 6,000", method: "Cash", status: "Completed", date: "2026-02-11" },
  { id: "TXN-005", booking: "BK-003", customer: "Fatima Noor", provider: "Hamza Ali", amount: "Rs 1,800", method: "JazzCash", status: "Refunded", date: "2026-02-12" }, // Added
  { id: "TXN-006", booking: "BK-006", customer: "Nimra Shah", provider: "Ali Hassan", amount: "Rs 2,000", method: "Easypaisa", status: "Pending", date: "2026-02-10" }, // Added
];

const AdminTransactions = () => {
  const [search, setSearch] = useState("");

  const filtered = transactionsData.filter(t => 
    t.id.toLowerCase().includes(search.toLowerCase()) || 
    t.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="txn-page-container">
        <div className="txn-header">
          <div className="header-text">
            <h1 className="page-main-title">Payment Transactions</h1>
            <p className="page-subtitle">Monitor all payment transactions for transparency</p>
          </div>
          <button className="export-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Export
          </button>
        </div>

        <div className="search-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="txn-search-input" 
          />
        </div>

        <div className="txn-table-card">
          <table className="txn-data-table">
            <thead>
              <tr>
                <th>TXN ID</th>
                <th>BOOKING</th>
                <th>CUSTOMER</th>
                <th>PROVIDER</th>
                <th>AMOUNT</th>
                <th>METHOD</th>
                <th>STATUS</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="table-row">
                  <td className="bold-text">{t.id}</td>
                  <td className="link-text">{t.booking}</td>
                  <td>{t.customer}</td>
                  <td>{t.provider}</td>
                  <td className="bold-text">{t.amount}</td>
                  <td>{t.method}</td>
                  <td><span className={`status-tag ${t.status.toLowerCase()}`}>{t.status}</span></td>
                  <td className="date-text">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;