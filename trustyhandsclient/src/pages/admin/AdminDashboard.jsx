import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { capitalize } from "../../utils/formatters";
import "../../styles/Dashboard.css";

const AdminDashboard = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState({ totalUsers: 0, totalWorkers: 0, totalBookings: 0 });
  const [workers, setWorkers] = useState([]);
  const [customers, setCustomers] = useState([]); 
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [contacts, setContacts] = useState([]); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("th_user") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      fetchAdminData();
    }
  }, [navigate]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [wRes, bRes, fRes, cRes, uRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/workers"),
        axios.get("http://localhost:5000/api/admin/bookings"),
        axios.get("http://localhost:5000/api/admin/feedback"),
        axios.get("http://localhost:5000/api/contact"),
        axios.get("http://localhost:5000/api/admin/users")
      ]);

      setWorkers(wRes.data.workers || []);
      setBookings(bRes.data.bookings || []);
      setFeedbacks(fRes.data.feedback || []);
      setContacts(cRes.data.messages || []);
      setCustomers(uRes.data.users || []);
      
      setStats({
        totalUsers: (uRes.data.users || []).length,
        totalWorkers: (wRes.data.workers || []).length,
        totalBookings: (bRes.data.bookings || []).length
      });
    } catch (err) {
      addToast("Failed to fetch administrative data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (workerId, status) => {
    try {
      // CORRECTED ENDPOINT: /api/admin/workers/:id/status
      await axios.put(`http://localhost:5000/api/admin/workers/${workerId}/status`, { status });
      addToast(`Worker ${status.toUpperCase()} Successfully`);
      fetchAdminData();
    } catch (err) {
      addToast("Approval operation failed on server", "error");
    }
  };

  const removeWorker = async (workerId) => {
    if (!window.confirm("Remove this expert permanently?")) return;
    try {
      // CORRECTED ENDPOINT: /api/admin/users/:id/suspend
      await axios.put(`http://localhost:5000/api/admin/users/${workerId}/suspend`, { isSuspended: true, reason: "Account Removed" });
      addToast("Expert removed from platformhub");
      fetchAdminData();
    } catch (err) {
      addToast("Removal failed", "error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="content-inner">
            <h2 className="console-title">Dashboard Overview</h2>
            <div className="stats-grid">
              <div className="stat-box">
                 <div className="stat-icon" style={{ background: "#e0f2f1", color: "#00796b" }}><i className="fas fa-users"></i></div>
                 <div className="stat-info"><h5>Users</h5><span>{stats.totalUsers}</span></div>
              </div>
              <div className="stat-box">
                 <div className="stat-icon" style={{ background: "#f1f8e9", color: "#388e3c" }}><i className="fas fa-certificate"></i></div>
                 <div className="stat-info"><h5>Experts</h5><span>{stats.totalWorkers}</span></div>
              </div>
              <div className="stat-box">
                 <div className="stat-icon" style={{ background: "#fff3e0", color: "#ef6c00" }}><i className="fas fa-calendar-check"></i></div>
                 <div className="stat-info"><h5>Tasks</h5><span>{stats.totalBookings}</span></div>
              </div>
            </div>

            <div className="card-pro">
               <h3 style={{ margin: "0 0 10px", fontSize: "1rem" }}>System Oversight</h3>
               <p style={{ color: "#888", fontSize: "0.9rem" }}>The platform is performing securely. All recent administrative activity is logged below.</p>
            </div>
          </div>
        );
      case "Manage Workers":
        return (
          <div className="content-inner">
             <h2 className="console-title">Manage Workers</h2>
             <div className="table-pro-container">
                <table className="table-pro">
                   <thead>
                      <tr><th>Name</th><th>Skill</th><th>Status</th><th>Operation</th></tr>
                   </thead>
                   <tbody>
                      {workers.map(w => (
                         <tr key={w._id}>
                            <td><strong>{capitalize(w.fullName)}</strong></td>
                            <td>{w.workerDetails?.skill}</td>
                            <td><span className={`status-badge ${w.workerDetails?.status === 'approved' ? 'badge-accepted' : 'badge-pending'}`}>{w.workerDetails?.status}</span></td>
                            <td>
                               <div style={{ display: "flex", gap: "10px" }}>
                                  {w.workerDetails?.status !== "approved" && (
                                     <button className="btn-primary-rect" style={{ padding: "6px 12px", fontSize: "0.75rem" }} onClick={() => handleStatusUpdate(w._id, 'approved')}>Approve</button>
                                  )}
                                  <button onClick={() => removeWorker(w._id)} style={{ padding: "6px", color: "#e91e63", background: "transparent", border: "none", cursor: "pointer", fontWeight: "800", fontSize: "0.75rem" }}>Remove</button>
                               </div>
                            </td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );
      case "Manage Users":
        return (
          <div className="content-inner">
             <h2 className="console-title">Manage Users</h2>
             <div className="table-pro-container">
                <table className="table-pro">
                   <thead>
                      <tr><th>Identity</th><th>Email Address</th><th>Phone</th></tr>
                   </thead>
                   <tbody>
                      {customers.map(u => (
                         <tr key={u._id}>
                            <td><strong>{capitalize(u.fullName)}</strong></td>
                            <td>{u.email}</td>
                            <td>{u.phone}</td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        );
      case "Bookings":
        return (
           <div className="content-inner">
             <h2 className="console-title">Bookings Log</h2>
             <div className="table-pro-container">
                <table className="table-pro">
                   <thead>
                      <tr><th>Client</th><th>Expert</th><th>Service</th><th>Status</th></tr>
                   </thead>
                   <tbody>
                      {bookings.map(b => (
                         <tr key={b._id}>
                            <td>{capitalize(b.customerId?.fullName)}</td>
                            <td>{capitalize(b.workerId?.fullName)}</td>
                            <td>{b.service}</td>
                            <td><span className={`status-badge badge-${b.status}`}>{b.status}</span></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           </div>
        );
      case "Feedback":
        return (
           <div className="content-inner">
             <h2 className="console-title">Feedback Oversight</h2>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {feedbacks.map(f => (
                   <div key={f._id} className="card-pro">
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: "10px" }}>
                         <strong>From: {capitalize(f.customerId?.fullName)}</strong>
                         <strong style={{ color: "var(--primary)" }}>To: {capitalize(f.workerId?.fullName)}</strong>
                      </div>
                      <div style={{ color: "#fbc02d", fontSize: "0.7rem", marginBottom: "10px" }}>
                         {[...Array(5)].map((_, i) => <i key={i} className={`fa${i < f.rating ? 's' : 'r'} fa-star`}></i>)}
                      </div>
                      <p style={{ margin: 0, fontStyle: "italic", fontSize: "0.9rem" }}>"{f.comment}"</p>
                   </div>
                ))}
             </div>
           </div>
        );
      case "Contact Messages":
        return (
           <div className="content-inner">
             <h2 className="console-title">Support Inbox</h2>
             <div className="table-pro-container">
                <table className="table-pro">
                   <thead>
                      <tr><th>Sender</th><th>Email</th><th>Note</th></tr>
                   </thead>
                   <tbody>
                      {contacts.map(c => (
                         <tr key={c._id}>
                            <td style={{ width: "20%" }}><strong>{c.name}</strong></td>
                            <td style={{ width: "25%" }}>{c.email}</td>
                            <td><div style={{ fontSize: "0.85rem", color: "#666", lineHeight: "1.4" }}>{c.message}</div></td>
                         </tr>
                      ))}
                   </tbody>
                </table>
             </div>
           </div>
        );
      default:
        return <div>Initializing Admin Portal...</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">ADMIN HUB</div>
        <ul className="sidebar-menu">
           {[
             { id: "Dashboard", icon: "shield-alt" },
             { id: "Manage Workers", icon: "user-lock" },
             { id: "Manage Users", icon: "users" },
             { id: "Bookings", icon: "project-diagram" },
             { id: "Feedback", icon: "award" },
             { id: "Contact Messages", icon: "inbox" }
           ].map(tab => (
              <li key={tab.id} onClick={() => setActiveTab(tab.id)} className={`sidebar-item ${activeTab === tab.id ? "active" : ""}`}>
                 <i className={`fas fa-${tab.icon}`}></i> {tab.id}
              </li>
           ))}
           <div className="logout-btn-container">
             <div className="logout-btn-box">
                <button onClick={handleLogout}>
                   <i className="fas fa-sign-out-alt"></i> Logout
                </button>
             </div>
          </div>
        </ul>
      </aside>
      <main className="dashboard-content">{renderContent()}</main>
    </div>
  );
};

export default AdminDashboard;
