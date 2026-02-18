import React, { useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminBookings.css";

const bookingsData = [
  { id: "BK-001", customer: "Ayesha Khan", provider: "Ali Hassan", service: "Plumbing", date: "2026-02-13", time: "10:00 AM", amount: "Rs 2,500", status: "Completed" },
  { id: "BK-002", customer: "Sara Ahmed", provider: "Usman Tariq", service: "Electrician", date: "2026-02-14", time: "02:00 PM", amount: "Rs 3,000", status: "Pending" },
  { id: "BK-003", customer: "Fatima Noor", provider: "Hamza Ali", service: "Cleaning", date: "2026-02-12", time: "09:00 AM", amount: "Rs 1,800", status: "Cancelled" },
  { id: "BK-004", customer: "Zainab Raza", provider: "Bilal Shah", service: "AC Repair", date: "2026-02-14", time: "11:30 AM", amount: "Rs 4,500", status: "Completed" },
  { id: "BK-005", customer: "Hira Malik", provider: "Kamran Iqbal", service: "Painting", date: "2026-02-11", time: "03:00 PM", amount: "Rs 6,000", status: "Completed" },
  { id: "BK-006", customer: "Nimra Shah", provider: "Ali Hassan", service: "Plumbing", date: "2026-02-10", time: "01:00 PM", amount: "Rs 2,000", status: "Pending" },
];

const AdminBookings = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filtered = bookingsData
    .filter((b) => filter === "All" || b.status === filter)
    .filter((b) => b.customer.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="bookings-page-wrapper">
        <div className="bookings-header-text">
          <h1 className="bookings-main-title">All Bookings</h1>
          <p className="bookings-sub-title">View and manage all booking histories and statuses</p>
        </div>

        <div className="bookings-filter-bar">
          <div className="bookings-search-field">
            <span className="search-icon-glass">🔍</span>
            <input 
              type="text" 
              placeholder="Search bookings..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="status-tabs-container">
            {["All", "Completed", "Pending", "Cancelled"].map((s) => (
              <button 
                key={s} 
                onClick={() => setFilter(s)}
                className={`status-tab-btn ${filter === s ? "active-blue" : ""}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="bookings-table-wrapper">
          <table className="lovable-bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Provider</th>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Amount</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id}>
                  <td className="booking-id-cell">{b.id}</td>
                  <td>{b.customer}</td>
                  <td>{b.provider}</td>
                  <td>{b.service}</td>
                  <td>{b.date}</td>
                  <td>{b.time}</td>
                  <td className="amount-cell">{b.amount}</td>
                  <td>
                    <span className={`status-badge-pill ${b.status.toLowerCase()}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="view-action-cell">
                    <button className="view-details-btn">👁️</button>
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

export default AdminBookings;