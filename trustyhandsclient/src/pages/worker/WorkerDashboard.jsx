import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { capitalize } from "../../utils/formatters";
import "../../styles/Dashboard.css";

const WorkerDashboard = () => {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [proposal, setProposal] = useState({ price: "", note: "" });

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    workerDetails: { skill: "", experience: "", serviceArea: "" }
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("th_user") || "null");
    if (!userData || userData.role !== "worker") {
      navigate("/login");
    } else {
      fetchFullProfile(userData.id || userData._id);
      fetchBookings(userData.id || userData._id);
      fetchReviews(userData.id || userData._id);
    }
  }, [navigate]);

  const fetchFullProfile = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/auth/profile/${userId}`);
      setUser(res.data.user);
      setProfileData({
        fullName: res.data.user.fullName,
        email: res.data.user.email,
        phone: res.data.user.phone,
        workerDetails: res.data.user.workerDetails || { skill: "", experience: "", serviceArea: "" }
      });
    } catch (err) {
      addToast("Profile sync failed", "error");
    }
  };

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/bookings/worker/${userId}`);
      setBookings(res.data.bookings || []);
    } catch (err) {
      addToast("Bookings update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/feedback`);
      const filtered = (res.data.feedback || []).filter(f => f.workerId?._id === userId);
      setMyReviews(filtered);
    } catch (err) {
      addToast("Reviews sync failed", "error");
    }
  };

  const handleAccept = async (bookingId) => {
    if (!proposal.price) {
      addToast("Enter cost quote", "error");
      return;
    }
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { 
        status: "accepted", 
        proposedPrice: proposal.price,
        workerNote: proposal.note 
      });
      addToast("Pricing proposal sent!");
      setAcceptingId(null);
      setProposal({ price: "", note: "" });
      fetchBookings(user._id);
    } catch (err) {
      addToast("Failed to propose", "error");
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, { status: newStatus });
      addToast(`Booking marked ${newStatus}`);
      fetchBookings(user._id);
    } catch (err) {
      addToast("Status update error", "error");
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const res = await axios.put(`http://localhost:5000/api/auth/profile/${user._id}`, profileData);
      setUser(res.data.user);
      const local = JSON.parse(localStorage.getItem("th_user"));
      local.fullName = res.data.user.fullName;
      localStorage.setItem("th_user", JSON.stringify(local));
      setIsEditing(false);
      addToast("Credentials updated successfully!");
    } catch (err) {
      addToast("Update failed", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) return <div className="dashboard-wrapper">Wait... Portal Initializing...</div>;

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <div className="content-inner">
            <h2 className="console-title">Worker Hub Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon" style={{ background: "#e8f5e9", color: "#2e7d32" }}><i className="fas fa-hammer"></i></div>
                <div className="stat-info"><h5>Status</h5><span>{user.workerDetails?.status}</span></div>
              </div>
              <div className="stat-box">
                <div className="stat-icon" style={{ background: "#f1f8e9", color: "#388e3c" }}><i className="fas fa-briefcase"></i></div>
                <div className="stat-info"><h5>Done</h5><span>{bookings.filter(b => b.status === "completed").length}</span></div>
              </div>
            </div>
            
            <div className="card-pro">
               <p style={{ color: "#777", fontSize: "0.95rem" }}>
                 Welcome to your workstation. Here you can manage your ongoing professional jobs and update your information.
               </p>
               <button className="btn-primary-rect" style={{ marginTop: "15px" }} onClick={() => setActiveTab("Job Requests")}>Manage My Tasks</button>
            </div>
          </div>
        );
      case "Job Requests":
        return (
          <div className="content-inner">
            <h2 className="console-title">Job Requests</h2>
            {bookings.filter(b => b.status === "pending").length === 0 ? (
               <div className="card-pro" style={{ textAlign: "center", padding: "40px" }}>No new logs.</div>
            ) : (
               <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                 {bookings.filter(b => b.status === "pending").map((booking) => (
                    <div key={booking._id} className="card-pro" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                       <div>
                          <h4 style={{ margin: "0 0 4px", fontSize: "1rem" }}>{capitalize(booking.customerId?.fullName)}</h4>
                          <span style={{ color: "var(--accent)", fontWeight: "800", fontSize: "0.8rem", textTransform: "uppercase" }}>{booking.service}</span>
                          <div style={{ margin: "8px 0", fontSize: "0.85rem", color: "#666" }}><i className="fas fa-map-pin"></i> {booking.address}</div>
                          <div style={{ fontSize: "0.8rem", color: "#999" }}>{booking.date} at {booking.time}</div>
                       </div>
                       <div>
                          {!acceptingId ? (
                            <div style={{ display: "flex", gap: "10px" }}>
                               <button className="btn-primary-rect" style={{ padding: "8px 20px" }} onClick={() => setAcceptingId(booking._id)}>Accept</button>
                               <button className="btn-orange-rect" style={{ background: "#fff5f5", color: "#d32f2f", border: "1px solid #d32f2f", boxShadow: "none" }} onClick={() => updateStatus(booking._id, "rejected")}>Reject</button>
                            </div>
                          ) : (
                            acceptingId === booking._id && (
                              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                                 <input type="number" style={{ width: "100px", padding: "8px", borderRadius: "6px", border: "1.5px solid #eee" }} placeholder="Price (₹)" value={proposal.price} onChange={(e) => setProposal({...proposal, price: e.target.value})} />
                                 <button className="btn-primary-rect" style={{ padding: "8px 15px" }} onClick={() => handleAccept(booking._id)}>Send Quote</button>
                                 <button onClick={() => setAcceptingId(null)} style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: "0.85rem" }}>Cancel</button>
                              </div>
                            )
                          )}
                       </div>
                    </div>
                 ))}
               </div>
            )}
          </div>
        );
      case "My Jobs":
        return (
          <div className="content-inner">
            <h2 className="console-title">My Professional Jobs</h2>
            <div className="table-pro-container">
              <table className="table-pro">
                 <thead>
                    <tr><th>Customer</th><th>Service</th><th>Date</th><th>Status</th><th>Operation</th></tr>
                 </thead>
                 <tbody>
                    {bookings.filter(b => b.status !== "pending").map(b => (
                      <tr key={b._id}>
                         <td>{capitalize(b.customerId?.fullName)}</td>
                         <td>{b.service}</td>
                         <td>{b.date}</td>
                         <td><span className={`status-badge badge-${b.status}`}>{b.status}</span></td>
                         <td>
                           {b.status === "accepted" && (
                              <button className="btn-primary-rect" style={{ padding: "6px 12px", fontSize: "0.8rem" }} onClick={() => updateStatus(b._id, "completed")}>Complete</button>
                           )}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
            </div>
          </div>
        );
      case "Reviews":
        return (
          <div className="content-inner">
             <h2 className="console-title">Expert Feedback</h2>
             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {myReviews.map(f => (
                   <div key={f._id} className="card-pro" style={{ borderLeft: "4px solid var(--primary)" }}>
                      <div style={{ color: "#fbc02d", fontSize: "0.75rem", marginBottom: "8px" }}>
                         {[...Array(5)].map((_, i) => <i key={i} className={`fa${i < f.rating ? 's' : 'r'} fa-star`}></i>)}
                      </div>
                      <p style={{ margin: 0, fontStyle: "italic", fontSize: "0.9rem" }}>"{f.comment}"</p>
                   </div>
                ))}
             </div>
          </div>
        );
      case "Profile":
        return (
          <div className="content-inner">
            <h2 className="console-title">Identity Settings</h2>
            
            <div className="dashboard-content-card profile-section-card">
              <div className="profile-settings-header">
                <h3>General Identity</h3>
                {!isEditing && (
                   <button className="btn-orange-rect" style={{ padding: "6px 15px", fontSize: "0.85rem" }} onClick={() => setIsEditing(true)}>
                     <i className="fas fa-edit"></i> Edit Credentials
                   </button>
                )}
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="profile-grid">
                  <div className="profile-input-group">
                    <label>Full Name</label>
                    <input type="text" value={profileData.fullName} readOnly={!isEditing} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} />
                  </div>
                  <div className="profile-input-group">
                    <label>Skill Set</label>
                    <input type="text" value={profileData.workerDetails.skill} readOnly={true} />
                  </div>
                  <div className="profile-input-group">
                    <label>Mobile Number</label>
                    <input type="text" value={profileData.phone} readOnly={!isEditing} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                  </div>
                  <div className="profile-input-group">
                    <label>Experience (Yrs)</label>
                    <input type="text" value={profileData.workerDetails.experience} readOnly={!isEditing} onChange={(e) => setProfileData({...profileData, workerDetails: {...profileData.workerDetails, experience: e.target.value}})} />
                  </div>
                  <div className="profile-input-group" style={{ gridColumn: "1 / -1" }}>
                     <label>Authorized Service Area</label>
                     <input type="text" value={profileData.workerDetails.serviceArea} readOnly={!isEditing} onChange={(e) => setProfileData({...profileData, workerDetails: {...profileData.workerDetails, serviceArea: e.target.value}})} />
                  </div>
                </div>

                {isEditing && (
                    <div style={{ marginTop: "25px", display: "flex", gap: "10px" }}>
                       <button type="submit" className="btn-primary-rect">Update Info</button>
                       <button type="button" className="btn-orange-rect" style={{ background: "#f8f8f8", color: "#666", border: "none" }} onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                )}
              </form>
            </div>
          </div>
        );
      default:
        return <div>Initializing...</div>;
    }
  };

  return (
    <div className="dashboard-wrapper">
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">WORKER HUB</div>
        <ul className="sidebar-menu">
          {[
            { id: "Home", icon: "home" },
            { id: "Job Requests", icon: "inbox" },
            { id: "My Jobs", icon: "clipboard-list" },
            { id: "Reviews", icon: "star" },
            { id: "Profile", icon: "user-cog" }
          ].map((tab) => (
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
      <main className="dashboard-content">
         {renderContent()}
      </main>
    </div>
  );
};

export default WorkerDashboard;
