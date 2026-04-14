import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { capitalize } from "../../utils/formatters";
import { compressImage } from "../../utils/imageUtils";
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
    dob: "",
    gender: "",
    profilePhoto: "",
    workerDetails: {
      skill: "",
      experience: "",
      serviceArea: "",
      profilePhoto: "",
    },
  });
  const [profilePhotoPreview, setProfilePhotoPreview] = useState("");
  const [profilePhotoData, setProfilePhotoData] = useState("");
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
      const res = await axios.get(
        `http://localhost:5000/api/auth/profile/${userId}`,
      );
      setUser(res.data.user);
      setProfileData({
        fullName: res.data.user.fullName,
        email: res.data.user.email,
        phone: res.data.user.phone,
        dob: res.data.user.dob ? res.data.user.dob.split("T")[0] : "",
        gender: res.data.user.gender || "",
        profilePhoto:
          res.data.user.profilePhoto ||
          res.data.user.workerDetails?.profilePhoto ||
          "",
        workerDetails: {
          skill: res.data.user.workerDetails?.skill || "",
          experience: res.data.user.workerDetails?.experience || "",
          serviceArea: res.data.user.workerDetails?.serviceArea || "",
          profilePhoto:
            res.data.user.workerDetails?.profilePhoto ||
            res.data.user.profilePhoto ||
            "",
        },
      });
      setProfilePhotoPreview(
        res.data.user.profilePhoto ||
          res.data.user.workerDetails?.profilePhoto ||
          "",
      );
    } catch (err) {
      addToast("Profile sync failed", "error");
    }
  };

  const fetchBookings = async (userId) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/bookings/worker/${userId}`,
      );
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
      const filtered = (res.data.feedback || []).filter(
        (f) => f.workerId?._id === userId,
      );
      setMyReviews(filtered);
    } catch (err) {
      addToast("Reviews sync failed", "error");
    }
  };

  const handleAccept = async (bookingId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          status: "accepted",
        },
      );
      addToast("The request has been accepted!");
      setAcceptingId(null);
      fetchBookings(user._id);
    } catch (err) {
      addToast("Failed to accept", "error");
    }
  };

  const updateStatus = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        { status: newStatus },
      );
      addToast(`Booking marked ${newStatus}`);
      fetchBookings(user._id);
    } catch (err) {
      addToast("Status update error", "error");
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    addToast("Uploading photo...", "info");
    try {
      const compressed = await compressImage(file, 150, 0.6);
      setProfilePhotoData(compressed);
      setProfilePhotoPreview(compressed);
      const res = await axios.put(
        `http://localhost:5000/api/auth/profile/${user._id}`,
        {
          profilePhoto: compressed,
          workerDetails: {
            ...profileData.workerDetails,
            profilePhoto: compressed,
          },
        },
      );
      setUser(res.data.user);
      const local = JSON.parse(localStorage.getItem("th_user") || "{}");
      if (local) {
        local.photoUpdated = true;
        localStorage.setItem("th_user", JSON.stringify(local));
      }
      addToast("Profile photo updated!");
    } catch (err) {
      console.error(err);
      addToast("Photo update failed — try a smaller image", "error");
    }
  };

  const isBookingCompletable = (bookingDate) => {
    const today = new Date().toISOString().split("T")[0];
    return bookingDate === today;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const payload = {
        ...profileData,
        profilePhoto: profilePhotoData || profileData.profilePhoto,
        workerDetails: {
          ...profileData.workerDetails,
          profilePhoto:
            profilePhotoData || profileData.workerDetails.profilePhoto,
        },
      };
      const res = await axios.put(
        `http://localhost:5000/api/auth/profile/${user._id}`,
        payload,
      );
      setUser(res.data.user);
      const local = JSON.parse(localStorage.getItem("th_user") || "{}");
      if (local) {
        local.fullName = res.data.user.fullName;
        local.photoUpdated = true;
        localStorage.setItem("th_user", JSON.stringify(local));
      }
      setIsEditing(false);
      addToast("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      addToast("Update failed", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user)
    return (
      <div className="dashboard-wrapper">Wait... Portal Initializing...</div>
    );

  const renderHeader = () => (
    <div className="dashboard-topbar">
      <div className="profile-summary-row">
        <div className="profile-photo-box">
          {profilePhotoPreview ? (
            <img src={profilePhotoPreview} alt="profile" />
          ) : (
            <span>{user.fullName?.charAt(0)?.toUpperCase() || "W"}</span>
          )}
        </div>
        <div>
          <p className="small-meta">Welcome back</p>
          <h3>Welcome, {user.fullName}!</h3>
          <p className="subtext">
            Manage your bookings, approvals, and profile from one place.
          </p>
        </div>
      </div>
      <div className="profile-photo-upload">
        <label className="upload-button">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
          />
        </label>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Home":
        return (
          <div className="content-inner">
            <h2 className="console-title">Worker Hub Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-box">
                <div
                  className="stat-icon"
                  style={{ background: "#e8f5e9", color: "#2e7d32" }}
                >
                  <i className="fas fa-hammer"></i>
                </div>
                <div className="stat-info">
                  <h5>Status</h5>
                  <span>{user.workerDetails?.status}</span>
                </div>
              </div>
              <div className="stat-box">
                <div
                  className="stat-icon"
                  style={{ background: "#f1f8e9", color: "#388e3c" }}
                >
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="stat-info">
                  <h5>Done</h5>
                  <span>
                    {bookings.filter((b) => b.status === "completed").length}
                  </span>
                </div>
              </div>
            </div>

            <div className="card-pro">
              <p style={{ color: "#777", fontSize: "0.95rem" }}>
                Welcome to your workstation. Here you can manage your ongoing
                professional jobs and update your information.
              </p>
              <button
                className="btn-primary-rect"
                style={{ marginTop: "15px" }}
                onClick={() => setActiveTab("Job Requests")}
              >
                Manage My Tasks
              </button>
            </div>
          </div>
        );
      case "Job Requests":
        return (
          <div className="content-inner">
            <h2 className="console-title">Job Requests</h2>
            {bookings.filter((b) => b.status === "pending").length === 0 ? (
              <div
                className="card-pro"
                style={{ textAlign: "center", padding: "40px" }}
              >
                No new logs.
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                {bookings
                  .filter((b) => b.status === "pending")
                  .map((booking) => (
                    <div
                      key={booking._id}
                      className="card-pro"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "15px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <div>
                          <h4 style={{ margin: "0 0 4px", fontSize: "1rem" }}>
                            {capitalize(booking.customerId?.fullName)}
                          </h4>
                          <span
                            style={{
                              color: "var(--accent)",
                              fontWeight: "800",
                              fontSize: "0.8rem",
                              textTransform: "uppercase",
                            }}
                          >
                            {booking.service}
                          </span>
                          <div
                            style={{
                              margin: "8px 0",
                              fontSize: "0.85rem",
                              color: "#666",
                            }}
                          >
                            <i className="fas fa-map-pin"></i> {booking.address}
                          </div>
                          <div style={{ fontSize: "0.8rem", color: "#999" }}>
                            {booking.date} at {booking.time}
                          </div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#444",
                              marginTop: "4px",
                            }}
                          >
                            <strong>Estimated Price:</strong> ₹{" "}
                            {booking.proposedPrice ?? "N/A"}
                          </div>
                        </div>
                        <div>
                          {!acceptingId || acceptingId !== booking._id ? (
                            <div style={{ display: "flex", gap: "10px" }}>
                              <button
                                className="btn-primary-rect"
                                style={{ padding: "8px 20px" }}
                                onClick={() => setAcceptingId(booking._id)}
                              >
                                Review Request
                              </button>
                              <button
                                className="btn-orange-rect"
                                style={{
                                  background: "#fff5f5",
                                  color: "#d32f2f",
                                  border: "1px solid #d32f2f",
                                  boxShadow: "none",
                                }}
                                onClick={() =>
                                  updateStatus(booking._id, "rejected")
                                }
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div
                              style={{
                                display: "flex",
                                gap: "12px",
                                alignItems: "center",
                              }}
                            >
                              <button
                                className="btn-primary-rect"
                                style={{ padding: "8px 25px" }}
                                onClick={() => handleAccept(booking._id)}
                              >
                                Accept Request
                              </button>
                              <button
                                onClick={() => setAcceptingId(null)}
                                style={{
                                  background: "transparent",
                                  border: "none",
                                  color: "#888",
                                  cursor: "pointer",
                                  fontSize: "0.85rem",
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {acceptingId === booking._id && (
                        <div
                          style={{
                            backgroundColor: "#f9fbf2",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px dashed var(--primary)",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            animation: "fadeIn 0.3s ease",
                          }}
                        >
                          <i
                            className="fas fa-info-circle"
                            style={{ color: "var(--primary)" }}
                          ></i>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "0.88rem",
                              color: "#4f5e3f",
                              fontWeight: "500",
                            }}
                          >
                            Contact with the customer to finalize the payment,
                            then click Accept.
                          </p>
                        </div>
                      )}
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
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Estimate</th>
                    <th>Status</th>
                    <th>Operation</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter((b) => b.status !== "pending")
                    .map((b) => (
                      <tr key={b._id}>
                        <td>{capitalize(b.customerId?.fullName)}</td>
                        <td>{b.service}</td>
                        <td>{b.date}</td>
                        <td>₹ {b.proposedPrice ?? "N/A"}</td>
                        <td>
                          <span className={`status-badge badge-${b.status}`}>
                            {b.status}
                          </span>
                        </td>
                        <td>
                          {b.status === "accepted" && (
                            <button
                              className="btn-primary-rect"
                              style={{
                                padding: "6px 12px",
                                fontSize: "0.8rem",
                              }}
                              disabled={!isBookingCompletable(b.date)}
                              title={
                                !isBookingCompletable(b.date)
                                  ? "You can mark as complete only on the scheduled date"
                                  : "Mark booking as completed"
                              }
                              onClick={() => updateStatus(b._id, "completed")}
                            >
                              Complete
                            </button>
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
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              {myReviews.map((f) => (
                <div
                  key={f._id}
                  className="card-pro"
                  style={{ borderLeft: "4px solid var(--primary)" }}
                >
                  <div
                    style={{
                      color: "#fbc02d",
                      fontSize: "0.75rem",
                      marginBottom: "8px",
                    }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`fa${i < f.rating ? "s" : "r"} fa-star`}
                      ></i>
                    ))}
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontStyle: "italic",
                      fontSize: "0.9rem",
                    }}
                  >
                    "{f.comment}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      case "Profile":
        return (
          <div className="content-inner slide-in">
            <h2 className="console-title">Identity Settings</h2>

            {/* Profile Photo Card - always visible */}
            <div
              className="card-pro animated-card"
              style={{
                marginBottom: "20px",
                display: "flex",
                alignItems: "center",
                gap: "24px",
              }}
            >
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid var(--primary)",
                  background: "#f0f2eb",
                  flexShrink: 0,
                }}
              >
                {profilePhotoPreview ? (
                  <img
                    src={profilePhotoPreview}
                    alt="profile"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "2rem",
                      fontWeight: 800,
                      color: "var(--primary)",
                    }}
                  >
                    {profileData.fullName?.charAt(0)?.toUpperCase() || "W"}
                  </div>
                )}
              </div>
              <div>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  {profileData.fullName}
                </p>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: "0.85rem",
                    color: "var(--accent)",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {profileData.workerDetails.skill}
                </p>
                <label
                  className="upload-button btn-hover-effect"
                  style={{ fontSize: "0.82rem", padding: "7px 14px" }}
                >
                  <i className="fas fa-camera"></i>&nbsp; Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                  />
                </label>
              </div>
            </div>

            {/* Fields Card */}
            <div className="profile-section-card animated-card">
              {!isEditing && (
                <div className="profile-settings-header">
                  <h3>General Identity</h3>
                  <button
                    className="btn-orange-rect btn-hover-effect"
                    style={{ padding: "6px 15px", fontSize: "0.85rem" }}
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fas fa-edit"></i>&nbsp; Edit Credentials
                  </button>
                </div>
              )}

              <form onSubmit={handleProfileUpdate}>
                <div className="profile-grid">
                  <div className="profile-input-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          fullName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Email Address</label>
                    <input type="email" value={profileData.email} disabled />
                  </div>
                  <div className="profile-input-group">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      value={profileData.phone}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Skill Set</label>
                    <input
                      type="text"
                      value={profileData.workerDetails.skill}
                      readOnly
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Date of Birth</label>
                    <input type="date" value={profileData.dob} readOnly />
                  </div>
                  <div className="profile-input-group">
                    <label>Gender</label>
                    <input type="text" value={profileData.gender} readOnly />
                  </div>
                  <div className="profile-input-group">
                    <label>Experience (Years)</label>
                    <input
                      type="text"
                      value={profileData.workerDetails.experience}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          workerDetails: {
                            ...profileData.workerDetails,
                            experience: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="profile-input-group">
                    <label>Service Area (km)</label>
                    <input
                      type="text"
                      value={profileData.workerDetails.serviceArea}
                      readOnly={!isEditing}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          workerDetails: {
                            ...profileData.workerDetails,
                            serviceArea: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                {isEditing && (
                  <div
                    style={{ marginTop: "25px", display: "flex", gap: "10px" }}
                  >
                    <button
                      type="submit"
                      className="btn-primary-rect btn-hover-effect"
                      disabled={saveLoading}
                    >
                      {saveLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn-orange-rect btn-hover-effect"
                      style={{
                        background: "#f8f8f8",
                        color: "#666",
                        border: "1px solid #ddd",
                      }}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
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
            { id: "Profile", icon: "user-cog" },
          ].map((tab) => (
            <li
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`sidebar-item ${activeTab === tab.id ? "active" : ""}`}
            >
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
        {renderHeader()}
        {renderContent()}
      </main>
    </div>
  );
};

export default WorkerDashboard;
