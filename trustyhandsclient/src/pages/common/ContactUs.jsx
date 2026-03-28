import React, { useState } from "react";
import "../../styles/ContactUs.css";

const ContactUs = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4500);
  };

  return (
    <div className="contact-page">
      <section className="contact-hero-section">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to assist you with any questions or requests</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <div className="contact-container">
            <div className="contact-form-container">
              <div className="contact-card">
                <h2>Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="contact-form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                    />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="email">Email Address</label>
                    <input id="email" name="email" type="email" required />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" name="phone" type="tel" />
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="subject">Subject</label>
                    <select id="subject" name="subject" required>
                      <option value="" disabled>
                        Choose a subject
                      </option>
                      <option value="service">Service Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="billing">Billing Question</option>
                      <option value="worker">Become a Worker</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>
                  <div className="contact-form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" required />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Send Message
                  </button>
                </form>

                {submitted && (
                  <div className="contact-form-success">
                    <i className="fas fa-check-circle" />
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you. We will contact you within 24 hours.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="contact-info-container">
              <div className="contact-card">
                <h2>Office Contact</h2>
                <div className="contact-info">
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      {" "}
                      <i className="fas fa-map-marker-alt" />{" "}
                    </div>
                    <div className="contact-info-content">
                      <h3>Headquarters</h3>
                      <p>Plot No. 45, Srinagar Colony, Guntur, AP 522006</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      {" "}
                      <i className="fas fa-phone-alt" />{" "}
                    </div>
                    <div className="contact-info-content">
                      <h3>Phone</h3>
                      <p>+91 86394 52100</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      {" "}
                      <i className="fas fa-envelope" />{" "}
                    </div>
                    <div className="contact-info-content">
                      <h3>Email</h3>
                      <p>support@trustyhands.com</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      {" "}
                      <i className="fas fa-clock" />{" "}
                    </div>
                    <div className="contact-info-content">
                      <h3>Hours</h3>
                      <p>Mon-Sat 9am - 8pm</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-map-container">
            <div className="contact-map-overlay">
              <h3>Visit Our Guntur Office</h3>
              <p>
                <i className="fas fa-map-marker-alt" /> Plot No. 45, Srinagar
                Colony
              </p>
              <p>
                <i className="fas fa-clock" /> Open today: 9:00 AM - 8:00 PM
              </p>
              <p>
                <i className="fas fa-phone" /> +91 86394 52100
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
