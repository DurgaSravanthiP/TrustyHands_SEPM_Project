import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { capitalize } from "../../utils/formatters";
import { compressImage } from "../../utils/imageUtils";
import "../../styles/Dashboard.css";

const AdminDashboard = () => {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalWorkers: 0,
    totalBookings: 0,
  });
  const [workers, setWorkers] = useState([]);
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [adminProfile, setAdminProfile] = useState(null);
  const [adminPhotoPreview, setAdminPhotoPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [proofModal, setProofModal] = useState(null); // { src, label }
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("th_user") || "null");
    if (!user || user.role !== "admin") {
      navigate("/login");
    } else {
      fetchAdminData(user.id || user._id);
    }
  }, [navigate]);

  const fetchAdminProfile = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/auth/profile/${userId}`,
      );
      setAdminProfile(res.data.user);
      setAdminPhotoPreview(res.data.user.profilePhoto || "");
    } catch (err) {
      console.warn("Admin profile sync failed", err);
    }
  };

  const fetchPendingWorkers = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/workers/pending",
      );
      setPendingWorkers(res.data.pending || []);
    } catch (err) {
      console.warn("Pending workers sync failed", err);
    }
  };

  const fetchAdminData = async (userId) => {
    try {
      setLoading(true);
      const [wRes, bRes, fRes, cRes, uRes] = await Promise.all([
        axios.get("http://localhost:5000/api/admin/workers"),
        axios.get("http://localhost:5000/api/admin/bookings"),
        axios.get("http://localhost:5000/api/admin/feedback"),
        axios.get("http://localhost:5000/api/contact"),
        axios.get("http://localhost:5000/api/admin/users"),
      ]);
      setWorkers(wRes.data.workers || []);
      setBookings(bRes.data.bookings || []);
      setFeedbacks(fRes.data.feedback || []);
      setContacts(cRes.data.messages || []);
      setCustomers(uRes.data.users || []);
      setStats({
        totalUsers: (uRes.data.users || []).length,
        totalWorkers: (wRes.data.workers || []).length,
        totalBookings: (bRes.data.bookings || []).length,
      });
      await fetchPendingWorkers();
      if (userId) await fetchAdminProfile(userId);
    } catch (err) {
      addToast("Failed to fetch administrative data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (workerId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/workers/${workerId}/status`,
        { status },
      );
      addToast(`Worker ${status.toUpperCase()} successfully`);
      fetchAdminData(adminProfile?._id || undefined);
    } catch (err) {
      addToast("Operation failed on server", "error");
    }
  };

  // Suspend = isSuspended:true (account locked, reversible by DB)
  const suspendWorker = async (workerId) => {
    if (
      !window.confirm(
        "Suspend this worker? Their account will be locked and they cannot log in.",
      )
    )
      return;
    try {
      await axios.put(
        `http://localhost:5000/api/admin/users/${workerId}/suspend`,
        {
          isSuspended: true,
          reason: "Suspended by Admin",
        },
      );
      addToast("Worker account suspended");
      fetchAdminData(adminProfile?._id || undefined);
    } catch (err) {
      addToast("Suspension failed", "error");
    }
  };

  const handleAdminPhotoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !adminProfile) return;
    addToast("Uploading photo...", "info");
    try {
      const compressed = await compressImage(file, 150, 0.6);
      await axios.put(
        `http://localhost:5000/api/auth/profile/${adminProfile._id}`,
        {
          profilePhoto: compressed,
        },
      );
      setAdminPhotoPreview(compressed);
      const local = JSON.parse(localStorage.getItem("th_user") || "null");
      if (local) {
        local.photoUpdated = true;
        localStorage.setItem("th_user", JSON.stringify(local));
      }
      fetchAdminProfile(adminProfile._id);
      addToast("Admin photo updated!");
    } catch (err) {
      addToast("Photo update failed — try a smaller image", "error");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const renderHeader = () => (
    <div className="dashboard-topbar">
      <div className="profile-summary-row">
        <div className="profile-photo-box">
          {adminPhotoPreview ? (
            <img src={adminPhotoPreview} alt="admin profile" />
          ) : (
            <span>
              {adminProfile?.fullName?.charAt(0)?.toUpperCase() || "A"}
            </span>
          )}
        </div>
        <div>
          <p className="small-meta">Administrator</p>
          <h3>Welcome, {adminProfile?.fullName || "Admin"}!</h3>
          <p className="subtext">
            Review worker applications, manage users, and monitor platform
            activity.
          </p>
        </div>
      </div>
      <div className="profile-photo-upload">
        <label className="upload-button btn-hover-effect">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleAdminPhotoChange}
          />
        </label>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return (
          <div className="content-inner slide-in">
            <h2 className="console-title">Dashboard Overview</h2>
            <div className="stats-grid">
              {[
                {
                  label: "Total Users",
                  val: stats.totalUsers,
                  icon: "users",
                  bg: "#e0f2f1",
                  col: "#00796b",
                },
                {
                  label: "Experts",
                  val: stats.totalWorkers,
                  icon: "certificate",
                  bg: "#f1f8e9",
                  col: "#388e3c",
                },
                {
                  label: "Total Tasks",
                  val: stats.totalBookings,
                  icon: "calendar-check",
                  bg: "#fff3e0",
                  col: "#ef6c00",
                },
                {
                  label: "Pending Approvals",
                  val: pendingWorkers.length,
                  icon: "user-clock",
                  bg: "#e3f2fd",
                  col: "#1976d2",
                },
              ].map((s) => (
                <div key={s.label} className="stat-box animate-pulse-hover">
                  <div
                    className="stat-icon"
                    style={{ background: s.bg, color: s.col }}
                  >
                    <i className={`fas fa-${s.icon}`}></i>
                  </div>
                  <div className="stat-info">
                    <h5>{s.label}</h5>
                    <span>{s.val}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-pro animated-card">
              <h3 style={{ margin: "0 0 10px", fontSize: "1rem" }}>
                System Oversight
              </h3>
              <p style={{ color: "#888", fontSize: "0.9rem" }}>
                The platform is performing securely. Use the sidebar to manage
                workers, bookings, and user accounts.
              </p>
            </div>
          </div>
        );

      case "Manage Workers":
        return (
          <div className="content-inner slide-in">
            <h2 className="console-title">Manage Workers</h2>

            {/* Legend explaining the buttons */}
            <div
              className="card-pro animated-card"
              style={{
                marginBottom: "20px",
                padding: "12px 18px",
                background: "#fffbf5",
                border: "1px solid #f0e0c0",
              }}
            >
              <p style={{ fontSize: "0.85rem", margin: 0, color: "#666" }}>
                <strong>Reject</strong> — Changes worker status to{" "}
                <em>rejected</em>. Their profile stays but they cannot log in as
                a worker. This can be reversed by approving again.
                <br />
                <strong>Suspend</strong> — Locks the account entirely. The
                worker cannot log in at all until restored from the database.
              </p>
            </div>

            <div className="table-pro-container animated-card">
              <table className="table-pro">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Skill</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map((w) => (
                    <tr key={w._id}>
                      <td>
                        <strong>{capitalize(w.fullName)}</strong>
                      </td>
                      <td>{w.workerDetails?.skill || "—"}</td>
                      <td>{w.email}</td>
                      <td>{w.phone || "—"}</td>
                      <td>
                        <span
                          className={`status-badge ${w.workerDetails?.status === "approved" ? "badge-accepted" : w.workerDetails?.status === "rejected" ? "badge-rejected" : "badge-pending"}`}
                        >
                          {w.workerDetails?.status || "pending"}
                        </span>
                      </td>
                      <td>
                        <div
                          style={{
                            display: "flex",
                            gap: "8px",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          {w.workerDetails?.status !== "approved" && (
                            <button
                              className="btn-primary-rect btn-hover-effect"
                              style={{
                                padding: "5px 12px",
                                fontSize: "0.75rem",
                              }}
                              onClick={() =>
                                handleStatusUpdate(w._id, "approved")
                              }
                            >
                              Approve
                            </button>
                          )}
                          {w.workerDetails?.status !== "rejected" && (
                            <button
                              className="btn-orange-rect btn-hover-effect"
                              style={{
                                padding: "5px 12px",
                                fontSize: "0.75rem",
                              }}
                              onClick={() =>
                                handleStatusUpdate(w._id, "rejected")
                              }
                            >
                              Reject
                            </button>
                          )}
                          <button
                            title="Lock account permanently"
                            onClick={() => suspendWorker(w._id)}
                            style={{
                              padding: "5px 12px",
                              color: "#c62828",
                              background: "#fdecea",
                              border: "1px solid #e57373",
                              borderRadius: "6px",
                              cursor: "pointer",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                            }}
                          >
                            Suspend
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Worker Approvals":
        return (
          <div className="content-inner slide-in">
            <h2 className="console-title">Worker Approvals</h2>
            {pendingWorkers.length === 0 ? (
              <div
                className="card-pro animated-card"
                style={{ padding: "30px", textAlign: "center" }}
              >
                <p style={{ margin: 0, color: "#666" }}>
                  No pending worker applications at the moment.
                </p>
              </div>
            ) : (
              <div className="approvals-grid">
                {pendingWorkers.map((worker) => (
                  <div
                    key={worker._id}
                    className="worker-card-slim animated-card"
                    style={{ gap: "16px" }}
                  >
                    {/* Profile photo row */}
                    <div className="worker-card-header">
                      <div
                        style={{
                          width: 45,
                          height: 45,
                          borderRadius: "50%",
                          overflow: "hidden",
                          background: "#e8f5e9",
                          border: "2px solid #a5d6a7",
                          flexShrink: 0,
                        }}
                      >
                        {worker.profilePhoto ||
                        worker.workerDetails?.profilePhoto ? (
                          <img
                            src={
                              worker.profilePhoto ||
                              worker.workerDetails?.profilePhoto
                            }
                            alt="profile"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setProofModal({
                                src:
                                  worker.profilePhoto ||
                                  worker.workerDetails?.profilePhoto,
                                label: `${worker.fullName}'s Profile Photo`,
                              })
                            }
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.4rem",
                              fontWeight: 800,
                              color: "var(--primary)",
                            }}
                          >
                            {worker.fullName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="worker-info-stack">
                        <h4>{capitalize(worker.fullName)}</h4>
                        <span>{worker.workerDetails?.skill || "Expert"}</span>
                      </div>
                    </div>

                    {/* ID Proof section */}
                    <div>
                      <p
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#888",
                          textTransform: "uppercase",
                          marginBottom: "6px",
                        }}
                      >
                        ID / Proof Document
                      </p>
                      {worker.workerDetails?.idProof ? (
                        <img
                          src={worker.workerDetails.idProof}
                          alt="ID Proof"
                          style={{
                            width: "100%",
                            maxHeight: "160px",
                            objectFit: "cover",
                            borderRadius: "8px",
                            cursor: "pointer",
                            border: "1px solid #ddd",
                          }}
                          onClick={() =>
                            setProofModal({
                              src: worker.workerDetails.idProof,
                              label: `${worker.fullName}'s ID Proof`,
                            })
                          }
                        />
                      ) : (
                        <div
                          style={{
                            padding: "12px",
                            background: "#f8f8f8",
                            borderRadius: "8px",
                            fontSize: "0.8rem",
                            color: "#999",
                            textAlign: "center",
                          }}
                        >
                          No proof document uploaded
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div
                      className="worker-stats-row"
                      style={{ flexWrap: "wrap" }}
                    >
                      <span>
                        <i className="fas fa-briefcase"></i>{" "}
                        {worker.workerDetails?.experience || "N/A"} Yrs
                      </span>
                      <span>
                        <i className="fas fa-map-marker-alt"></i>{" "}
                        {worker.workerDetails?.serviceArea || "—"} km
                      </span>
                    </div>
                    <div className="worker-location-row">
                      <i className="fas fa-phone"></i>
                      <span>{worker.phone || "No phone"}</span>
                    </div>
                    <div className="worker-location-row">
                      <i className="fas fa-envelope"></i>
                      <span>{worker.email}</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        className="btn-primary-rect btn-hover-effect"
                        style={{ flex: 1, padding: "8px" }}
                        onClick={() =>
                          handleStatusUpdate(worker._id, "approved")
                        }
                      >
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button
                        className="btn-orange-rect btn-hover-effect"
                        style={{ flex: 1, padding: "8px" }}
                        onClick={() =>
                          handleStatusUpdate(worker._id, "rejected")
                        }
                      >
                        <i className="fas fa-times"></i> Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Proof Image Modal */}
            {proofModal && (
              <div
                onClick={() => setProofModal(null)}
                style={{
                  position: "fixed",
                  inset: 0,
                  background: "rgba(0,0,0,0.7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 9999,
                }}
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "20px",
                    maxWidth: "90vw",
                    maxHeight: "90vh",
                    overflow: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "12px",
                    }}
                  >
                    <strong style={{ fontSize: "0.95rem" }}>
                      {proofModal.label}
                    </strong>
                    <button
                      onClick={() => setProofModal(null)}
                      style={{
                        background: "none",
                        border: "none",
                        fontSize: "1.2rem",
                        cursor: "pointer",
                        color: "#555",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <img
                    src={proofModal.src}
                    alt={proofModal.label}
                    style={{
                      maxWidth: "70vw",
                      maxHeight: "75vh",
                      borderRadius: "8px",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );

      case "Manage Users":
        return (
          <div className="content-inner slide-in">
            <h2 className="console-title">Manage Users</h2>
            <div className="table-pro-container animated-card">
              <table className="table-pro">
                <thead>
                  <tr>
                    <th>Identity</th>
                    <th>Email Address</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <strong>{capitalize(u.fullName)}</strong>
                      </td>
                      <td>{u.email}</td>
                      <td>{u.phone || "—"}</td>
                      <td>{u.address?.city || u.address?.line || "—"}</td>
                      <td>
                        <span
                          className={`status-badge ${u.role === "admin" ? "badge-accepted" : "badge-pending"}`}
                        >
                          {u.role || "customer"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Bookings":
        return (
          <div className="content-inner slide-in">
            <h2 className="console-title">Bookings Log</h2>
            <div className="table-pro-container animated-card">
              <table className="table-pro">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Expert</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td>{capitalize(b.customerId?.fullName)}</td>
                      <td>{capitalize(b.workerId?.fullName)}</td>
                      <td>{b.service}</td>
                      <td>{b.date}</td>
                      <td>
                        <span className={`status-badge badge-${b.status}`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Feedback":
        return (
          <div className="content-inner slide-in">
            <h2 className="console-title">Feedback Overview</h2>
            <div className="table-pro-container animated-card">
              <table className="table-pro">
                <thead>
                  <tr>
                    <th>From (Customer)</th>
                    <th>To (Worker)</th>
                    <th>Rating</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((f) => (
                    <tr key={f._id}>
                      <td>
                        <strong>
                          {capitalize(f.customerId?.fullName) || "—"}
                        </strong>
                      </td>
                      <td>
                        <strong style={{ color: "var(--primary)" }}>
                          {capitalize(f.workerId?.fullName) || "—"}
                        </strong>
                      </td>
                      <td>
                        <div
                          style={{
                            color: "#fbc02d",
                            fontSize: "0.8rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa${i < f.rating ? "s" : "r"} fa-star`}
                            ></i>
                          ))}
                          <span
                            style={{
                              color: "#555",
                              marginLeft: "6px",
                              fontWeight: 700,
                            }}
                          >
                            {f.rating}/5
                          </span>
                        </div>
                      </td>
                      <td
                        style={{
                          fontStyle: "italic",
                          color: "#555",
                          fontSize: "0.88rem",
                        }}
                      >
                        "{f.comment}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "Contact Messages":
        return (
          <div className="content-inner slide-in">
            <h2 className="console-title">Support Inbox</h2>
            <div className="table-pro-container animated-card">
              <table className="table-pro">
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Email</th>
                    <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={c._id}>
                      <td style={{ width: "18%" }}>
                        <strong>{c.name}</strong>
                      </td>
                      <td style={{ width: "22%" }}>{c.email}</td>
                      <td
                        style={{
                          fontSize: "0.85rem",
                          color: "#555",
                          lineHeight: "1.5",
                        }}
                      >
                        {c.message}
                      </td>
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
            { id: "Worker Approvals", icon: "user-check" },
            { id: "Manage Users", icon: "users" },
            { id: "Bookings", icon: "project-diagram" },
            { id: "Feedback", icon: "award" },
            { id: "Contact Messages", icon: "inbox" },
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

export default AdminDashboard;
