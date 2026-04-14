import React from "react";
import { capitalize } from "../../../utils/formatters";

const MyReviewsTab = ({ myReviews }) => {
  return (
    <div className="content-inner slide-in">
      <h2 className="console-title">My Reviews</h2>
      {myReviews.length === 0 ? (
        <div
          className="card-pro animated-card"
          style={{ textAlign: "center", padding: "40px" }}
        >
          No reviews logged.
        </div>
      ) : (
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
              className="card-pro animate-fade-in-up"
              style={{ borderLeft: "4px solid var(--accent)" }}
            >
              <h4 style={{ margin: "0 0 5px", fontSize: "1rem" }}>
                {capitalize(f.workerId?.fullName)}
              </h4>
              <div
                style={{
                  color: "#fbc02d",
                  fontSize: "0.8rem",
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
      )}
    </div>
  );
};

export default MyReviewsTab;
