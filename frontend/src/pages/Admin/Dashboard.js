import React, { useState } from 'react';
import AdminLayout from "../../components/AdminLayout";
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeBar, setActiveBar] = useState(null);

  const stats = [
    { title: "Total Users", value: "1,245", trend: "↑ 12%", icon: "👤", color: "blue" },
    { title: "Service Providers", value: "328", trend: "↑ 8%", icon: "💼", color: "orange" },
    { title: "Total Bookings", value: "3,567", trend: "↑ 15%", icon: "📅", color: "green" },
    { title: "Revenue", value: "Rs 485,000", trend: "↑ 5%", icon: "💳", color: "yellow" }
  ];

  const chartData = [
    { month: "Jan", bookings: 45, h: "38%" },
    { month: "Feb", bookings: 62, h: "52%" },
    { month: "Mar", bookings: 78, h: "65%" },
    { month: "Apr", bookings: 90, h: "75%" },
    { month: "May", bookings: 110, h: "92%" },
    { month: "Jun", bookings: 95, h: "80%" },
  ];

  const recentBookings = [
    { id: "BK-001", customer: "Ayesha Khan", service: "Plumbing", provider: "Ali Hassan", status: "Completed", date: "2026-02-13" },
    { id: "BK-002", customer: "Sara Ahmed", service: "Electrician", provider: "Usman Tariq", status: "Pending", date: "2026-02-14" },
    { id: "BK-003", customer: "Fatima Noor", service: "Cleaning", provider: "Hamza Ali", status: "Cancelled", date: "2026-02-12" },
    { id: "BK-004", customer: "Zainab Raza", service: "AC Repair", provider: "Bilal Shah", status: "Completed", date: "2026-02-14" },
  ];

  return (
    <AdminLayout>
      <div className="dashboard-scroll-wrapper">
        <div className="dash-main-header">
          <h1 className="admin-page-title">Dashboard</h1>
          <p className="admin-page-subtitle">Overview of your platform performance</p>
        </div>

        {/* 1. Stats Cards Row */}
        <div className="stats-row-container">
          {stats.map((item, index) => (
            <div key={index} className="stat-card">
              <div className="stat-content">
                <p className="stat-label">{item.title}</p>
                <h2 className="stat-value">{item.value}</h2>
                <p className="stat-trend">{item.trend} <span className="month-text">this month</span></p>
              </div>
              <div className={`stat-icon-box ${item.color}`}>{item.icon}</div>
            </div>
          ))}
        </div>

        {/* 2. Parallel Graphs Row */}
        <div className="parallel-charts-grid">
          <div className="chart-box">
            <h3 className="chart-title">Monthly Bookings</h3>
            <div className="graph-area">
              <div className="y-axis-labels"><span>120</span><span>90</span><span>60</span><span>30</span><span>0</span></div>
              <div className="bars-box">
                {chartData.map((d, i) => (
                  <div key={i} className="bar-wrapper" onMouseEnter={() => setActiveBar(i)} onMouseLeave={() => setActiveBar(null)}>
                    {activeBar === i && (
                      <div className="bar-tooltip">
                        <strong>{d.month}</strong>
                        <span>bookings: {d.bookings}</span>
                      </div>
                    )}
                    <div className="actual-blue-bar" style={{ height: d.h }}></div>
                    <span className="bar-month-label">{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-box">
            <h3 className="chart-title">Booking Status</h3>
            <div className="donut-center-container">
              <div className="donut-ring-visual"></div>
              <div className="donut-legend-list">
                <div className="leg-item"><span className="dot g"></span> Completed</div>
                <div className="leg-item"><span className="dot y"></span> Pending</div>
                <div className="dot-item"><span className="dot r"></span> Cancelled</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Recent Bookings Table Section */}
        <div className="recent-bookings-section">
          <h3 className="section-title-text">Recent Bookings</h3>
          <div className="table-card-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CUSTOMER</th>
                  <th>SERVICE</th>
                  <th>PROVIDER</th>
                  <th>STATUS</th>
                  <th>DATE</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((bk) => (
                  <tr key={bk.id}>
                    <td className="bold-id">{bk.id}</td>
                    <td>{bk.customer}</td>
                    <td>{bk.service}</td>
                    <td>{bk.provider}</td>
                    <td>
                      <span className={`status-pill ${bk.status.toLowerCase()}`}>
                        {bk.status}
                      </span>
                    </td>
                    <td className="date-cell">{bk.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;