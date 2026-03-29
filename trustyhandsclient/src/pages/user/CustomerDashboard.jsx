import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BookingModal from "../../components/BookingModal";
import FeedbackModal from "../../components/FeedbackModal";
import { useToast } from "../../context/ToastContext";
import { capitalize } from "../../utils/formatters";
import "../../styles/Dashboard.css";

const CustomerDashboard = () => {
  const { addToast } = useToast();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [activeFeedback, setActiveFeedback] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: { line: "", city: "", state: "", pincode: "" }
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("th_user") || "null");
    if (!userData || userData.role !== "customer") {
      navigate("/login");
    } else {
      fetchFullProfile(userData.id || userData._id);
      fetchBookings(userData.id || userData._id);
      fetchReviews(userData.id || userData._id);
      fetchWorkers();
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
        address: res.data.user.address || { line: "", city: "", state: "", pincode: "" }
      });
    } catch (err) {
      addToast("Profile sync failed", "error");
    }
  };

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/bookings/customer/${userId}`);
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
      const filtered = (res.data.feedback || []).filter(f => f.customerId?._id === userId);
      setMyReviews(filtered);
    } catch (err) {
      addToast("Reviews sync failed", "error");
    }
  };

  const fetchWorkers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/workers");
      const approved = (res.data.workers || []).filter(w => w.workerDetails?.status === "approved");
      setWorkers(approved);
    } catch (err) {
      addToast("Workers list update failed", "error");
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

  if (!user) return <div className="dashboard-wrapper">Wait... Hub Loading...</div>;

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <div className="content-inner">
            <h2 className="console-title">Welcome Home</h2>
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon" style={{ background: "#e3f2fd", color: "#1976d2" }}><i className="fas fa-calendar-alt"></i></div>
                <div className="stat-info"><h5>Bookings</h5><span>{bookings.length}</span></div>
              </div>
              <div className="stat-box">
                <div className="stat-icon" style={{ background: "#f0f7f0", color: "#2ecc71" }}><i className="fas fa-check-circle"></i></div>
                <div className="stat-info"><h5>Done</h5><span>{bookings.filter(b => b.status === 'completed').length}</span></div>
              </div>
            </div>
            
            <div className="card-pro">
               <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>
                 Find pre-verified experts for all your domestic and maintenance services. Every professional is community-rated for your trust and security.
               </p>
               <button className="btn-primary-rect" style={{ marginTop: "15px" }} onClick={() => setActiveTab("Search Services")}>Search Experts</button>
            </div>
          </div>
        );
      case "Search Services":
        return (
          <div className="content-inner">
            <h2 className="console-title">Professional Hub</h2>
            <div className="card-pro" style={{ padding: "8px", borderRadius: "10px", marginBottom: "25px", border: "1.5px solid #f0f0f0" }}>
               <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                 <i className="fas fa-search" style={{ position: "absolute", left: "12px", color: "var(--primary)" }}></i>
                 <input 
                   type="text" 
                   placeholder="Search service name (e.g. Electrician)..." 
                   style={{ width: "100%", padding: "10px 10px 10px 40px", border: "none", background: "transparent", fontSize: "0.9rem", fontWeight: "700" }}
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "20px" }}>
              {workers
                .filter(w => 
                  (w.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
                  (w.workerDetails?.skill || "").toLowerCase().includes(searchTerm.toLowerCase())
                ).map(w => (
                  <div key={w._id} className="worker-card-slim">
                    <div className="worker-card-header">
                       <div className="worker-avatar-circle">{w.fullName[0]}</div>
                       <div className="worker-info-stack">
                          <h4>{capitalize(w.fullName)}</h4>
                          <span>{w.workerDetails?.skill}</span>
                       </div>
                    </div>
                    <div className="worker-stats-row">
                       <span><i className="fas fa-star"></i> 5.0</span>
                       <span><i className="fas fa-user-clock"></i> {w.workerDetails?.experience} Yrs</span>
                    </div>
                    <div className="worker-location-row">
                       <i className="fas fa-map-pin"></i> Serves {w.workerDetails?.serviceArea || 'Guntur'}
                    </div>
                    <button className="btn-hire-compact" onClick={() => setSelectedWorker(w)}>Hire Professional</button>
                  </div>
                ))}
            </div>
          </div>
        );
      case "My Bookings":
        return (
          <div className="content-inner">
            <h2 className="console-title">My Bookings</h2>
            {loading ? (
               <div style={{ textAlign: "center", padding: "40px" }}>Loading logs...</div>
            ) : bookings.length === 0 ? (
               <div className="card-pro" style={{ textAlign: "center", padding: "40px" }}>No orders listed.</div>
            ) : (
               <div className="table-pro-container">
                 <table className="table-pro">
                    <thead>
                       <tr><th>Professional</th><th>Task</th><th>Schedule</th><th>Fees</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                       {bookings.map(b => (
                         <tr key={b._id}>
                            <td>{capitalize(b.workerId?.fullName)}</td>
                            <td>{b.service}</td>
                            <td>{b.date} at {b.time}</td>
                            <td><strong>{b.finalPrice ? `₹${b.finalPrice}` : 'Negotiating'}</strong></td>
                            <td><span className={`status-badge badge-${b.status}`}>{b.status}</span></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            )}
          </div>
        );
      case "My Reviews":
        return (
          <div className="content-inner">
            <h2 className="console-title">My Reviews</h2>
             {myReviews.length === 0 ? (
                <div className="card-pro" style={{ textAlign: "center", padding: "40px" }}>No reviews logged.</div>
             ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                   {myReviews.map(f => (
                      <div key={f._id} className="card-pro" style={{ borderLeft: "4px solid var(--accent)" }}>
                         <h4 style={{ margin: "0 0 5px", fontSize: "1rem" }}>{capitalize(f.workerId?.fullName)}</h4>
                         <div style={{ color: "#fbc02d", fontSize: "0.8rem", marginBottom: "8px" }}>
                            {[...Array(5)].map((_, i) => <i key={i} className={`fa${i < f.rating ? 's' : 'r'} fa-star`}></i>)}
                         </div>
                         <p style={{ margin: 0, fontStyle: "italic", fontSize: "0.9rem" }}>"{f.comment}"</p>
                      </div>
                   ))}
                </div>
             )}
          </div>
        );
      case "Profile":
        return (
          <div className="content-inner">
            <h2 className="console-title">Account Settings</h2>
            
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
                    <label>Email Address</label>
                    <input type="email" value={profileData.email} readOnly={!isEditing} onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
                  </div>
                  <div className="profile-input-group">
                    <label>Mobile Contact</label>
                    <input type="text" value={profileData.phone} readOnly={!isEditing} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                  </div>
                  <div className="profile-input-group">
                    <label>Primary City</label>
                    <input type="text" value={profileData.address.city} readOnly={!isEditing} onChange={(e) => setProfileData({...profileData, address: {...profileData.address, city: e.target.value}})} />
                  </div>
                  <div className="profile-input-group" style={{ gridColumn: "1 / -1" }}>
                    <label>Full Hub Address</label>
                    <textarea value={profileData.address.line} readOnly={!isEditing} rows="2" onChange={(e) => setProfileData({...profileData, address: {...profileData.address, line: e.target.value}})} />
                  </div>
                </div>

                {isEditing && (
                  <div style={{ marginTop: "25px", display: "flex", gap: "10px" }}>
                    <button type="submit" className="btn-primary-rect" disabled={saveLoading}>Update Hub</button>
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
        <div className="sidebar-logo">USER HUB</div>
        <ul className="sidebar-menu">
          {[
            { id: "Home", icon: "home" },
            { id: "Search Services", icon: "search" },
            { id: "My Bookings", icon: "calendar-check" },
            { id: "My Reviews", icon: "star" },
            { id: "Profile", icon: "user-cog" }
          ].map((tab) => (
            <li key={tab.id} onClick={() => setActiveTab(tab.id)} className={`sidebar-item ${activeTab === tab.id ? "active" : ""}`}>
              <i className={`fas fa-${tab.icon}`}></i> {tab.id}
            </li>
          ))}
          {/* Logout button placed directly after Profile */}
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

      {selectedWorker && (
        <BookingModal 
          worker={selectedWorker} 
          onClose={() => setSelectedWorker(null)} 
          onBookingComplete={() => {
            setSelectedWorker(null);
            fetchBookings(user._id);
            setActiveTab("My Bookings");
            addToast("Request sent successfully!");
          }}
        />
      )}

      {activeFeedback && (
         <FeedbackModal 
           booking={activeFeedback}
           onClose={() => setActiveFeedback(null)}
           onComplete={() => {
              setActiveFeedback(null);
              fetchBookings(user._id);
           }}
         />
      )}
    </div>
  );
};

export default CustomerDashboard;
