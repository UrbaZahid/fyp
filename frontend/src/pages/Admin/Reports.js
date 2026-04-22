import React from "react";
import AdminLayout from "../../components/AdminLayout";
import "./AdminReports.css";

const AdminReports = () => {
  return (
    <AdminLayout>
      <div className="reports-container">
        
        <div className="reports-header">
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Platform performance, revenue stats, and booking insights</p>
        </div>

        {/* 1. Stat Cards Row */}
        <div className="stats-row">
          {[
            { label: "Total Revenue", val: "Rs 2.39M", trend: "↑ 18% vs last quarter", type: "up", color: "orange", icon: "$" },
            { label: "Completed Bookings", val: "2,320", type: "", color: "green", icon: "✓" },
            { label: "Pending Bookings", val: "712", type: "", color: "yellow", icon: "⌛" },
            { label: "Cancellation Rate", val: "15%", trend: "↓ 2% decrease", type: "down", color: "blue", icon: "📊" }
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-info">
                <span className="stat-label">{s.label}</span>
                <h2 className="stat-value">{s.val}</h2>
                {s.trend && <span className={`stat-trend ${s.type}`}>{s.trend}</span>}
              </div>
              <div className={`stat-icon box-${s.color}`}>{s.icon}</div>
            </div>
          ))}
        </div>

        {/* 2. First Visual Row (Parallel) */}
        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Top Booked Services</h3>
            <div className="h-bar-container">
              {[
                { n: "Plumbing", v: 120, p: 100 },
                { n: "Electrician", v: 98, p: 82 },
                { n: "Cleaning", v: 85, p: 70 },
                { n: "AC Repair", v: 72, p: 60 },
                { n: "Painting", v: 60, p: 50 },
                { n: "Carpentry", v: 45, p: 38 }
              ].map((item, idx) => (
                <div key={idx} className="h-bar-row">
                  <span className="h-label">{item.n}</span>
                  <div className="h-track"><div className="h-fill" style={{ width: `${item.p}%` }}></div></div>
                  <span className="h-val">{item.v}</span>
                </div>
              ))}
              <div className="h-axis"><span>0</span><span>30</span><span>60</span><span>90</span><span>120</span></div>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Booking Status Summary</h3>
            <div className="donut-wrapper">
              <svg viewBox="0 0 36 36" className="donut-svg">
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#22c55e" strokeWidth="3.8" strokeDasharray="65 35" strokeDashoffset="25"></circle>
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#f59e0b" strokeWidth="3.8" strokeDasharray="20 80" strokeDashoffset="-40"></circle>
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#ef4444" strokeWidth="3.8" strokeDasharray="15 85" strokeDashoffset="-60"></circle>
              </svg>
              <div className="donut-label l-green">Completed 65%</div>
              <div className="donut-label l-yellow">Pending 20%</div>
              <div className="donut-label l-red">Cancelled 15%</div>
            </div>
            <div className="legend">
              <div className="leg-item"><span className="dot g"></span> Completed: 2320</div>
              <div className="leg-item"><span className="dot y"></span> Pending: 712</div>
              <div className="leg-item"><span className="dot r"></span> Cancelled: 535</div>
            </div>
          </div>
        </div>

        {/* 3. Second Visual Row (Parallel) */}
        <div className="charts-grid mt-20">
          <div className="chart-card">
            <h3 className="chart-title">Revenue by Service Category</h3>
            <div className="v-bar-chart">
              <div className="v-axis-y"><span>160k</span><span>80k</span><span>0k</span></div>
              <div className="v-bars-container">
                {[
                  { n: "Plumbing", h: 75 }, { n: "Electrician", h: 60 },
                  { n: "Cleaning", h: 45 }, { n: "AC Repair", h: 90 }, { n: "Painting", h: 55 }
                ].map((b, i) => (
                  <div key={i} className="v-bar-col">
                    <div className="v-bar-track"><div className="v-bar-fill" style={{ height: `${b.h}%` }}></div></div>
                    <span className="v-label">{b.n}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Monthly Revenue Trend</h3>
            <div className="line-container">
              <svg viewBox="0 0 500 150" className="line-svg">
                <path fill="none" stroke="#3b82f6" strokeWidth="3" d="M10,120 Q100,100 200,80 T400,60 L500,50" />
                <circle cx="10" cy="120" r="5" fill="#3b82f6" /><circle cx="100" cy="100" r="5" fill="#3b82f6" />
                <circle cx="200" cy="80" r="5" fill="#3b82f6" /><circle cx="350" cy="70" r="5" fill="#3b82f6" />
                <circle cx="480" cy="50" r="5" fill="#3b82f6" />
              </svg>
              <div className="line-labels"><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span></div>
            </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminReports;