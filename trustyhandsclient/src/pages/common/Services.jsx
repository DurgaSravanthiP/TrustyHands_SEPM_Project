import React, { useState, useMemo } from "react";
import "../../styles/Services.css";

const servicesData = [
  {
    id: 1,
    title: "Plumbing Services",
    icon: "fa-faucet",
    description:
      "Expert solutions for leaks, installations, and all plumbing needs.",
    category: "repairs",
    rating: 4.8,
    reviews: 124,
    price: "₹500-1500",
    workers: 32,
  },
  {
    id: 2,
    title: "Electrical Work",
    icon: "fa-bolt",
    description:
      "Certified electricians for installations, repairs and maintenance.",
    category: "repairs",
    rating: 4.9,
    reviews: 98,
    price: "₹600-2000",
    workers: 28,
  },
  {
    id: 3,
    title: "Deep Cleaning",
    icon: "fa-broom",
    description: "Thorough cleaning for homes, offices and commercial spaces.",
    category: "domestic",
    rating: 4.7,
    reviews: 210,
    price: "₹800-2500",
    workers: 45,
  },
  {
    id: 4,
    title: "Carpentry",
    icon: "fa-hammer",
    description: "Custom woodwork, furniture repair and installations.",
    category: "repairs",
    rating: 4.8,
    reviews: 76,
    price: "₹700-1800",
    workers: 22,
  },
  {
    id: 5,
    title: "Painting Services",
    icon: "fa-paint-roller",
    description: "Interior and exterior painting for homes and businesses.",
    category: "repairs",
    rating: 4.7,
    reviews: 89,
    price: "₹1000-5000",
    workers: 31,
  },
  {
    id: 6,
    title: "AC Service",
    icon: "fa-wind",
    description: "Maintenance, repair and installation for all AC units.",
    category: "repairs",
    rating: 4.9,
    reviews: 142,
    price: "₹500-1200",
    workers: 38,
  },
  {
    id: 7,
    title: "Packers & Movers",
    icon: "fa-boxes",
    description: "Professional packing and relocation services.",
    category: "movers",
    rating: 4.6,
    reviews: 67,
    price: "₹1500-8000",
    workers: 24,
  },
  {
    id: 8,
    title: "Kitchen Cleaning",
    icon: "fa-utensils",
    description: "Deep cleaning for kitchens and appliances.",
    category: "domestic",
    rating: 4.8,
    reviews: 93,
    price: "₹600-1500",
    workers: 29,
  },
  {
    id: 9,
    title: "Event Staffing",
    icon: "fa-glass-cheers",
    description: "Professional staff for events, parties and gatherings.",
    category: "event",
    rating: 4.7,
    reviews: 78,
    price: "₹250-500/hr",
    workers: 42,
  },
  {
    id: 10,
    title: "Home Sanitization",
    icon: "fa-hand-sparkles",
    description: "Professional sanitization for healthy living.",
    category: "domestic",
    rating: 4.9,
    reviews: 115,
    price: "₹900-2000",
    workers: 33,
  },
  {
    id: 11,
    title: "Babysitting",
    icon: "fa-baby",
    description: "Reliable childcare professionals for your family.",
    category: "domestic",
    rating: 4.8,
    reviews: 86,
    price: "₹150-300/hr",
    workers: 27,
  },
  {
    id: 12,
    title: "Gardening Services",
    icon: "fa-leaf",
    description: "Landscaping, lawn care and garden maintenance.",
    category: "domestic",
    rating: 4.7,
    reviews: 64,
    price: "₹700-2000",
    workers: 19,
  },
  {
    id: 13,
    title: "Bathroom Cleaning",
    icon: "fa-shower",
    description: "Deep cleaning and sanitization for bathrooms.",
    category: "domestic",
    rating: 4.8,
    reviews: 92,
    price: "₹700-1800",
    workers: 26,
  },
  {
    id: 14,
    title: "Fridge Repair",
    icon: "fa-snowflake",
    description: "Expert repair for all refrigerator models.",
    category: "repairs",
    rating: 4.7,
    reviews: 75,
    price: "₹800-2500",
    workers: 18,
  },
  {
    id: 15,
    title: "TV Repair",
    icon: "fa-tv",
    description: "Professional repair for all television types.",
    category: "repairs",
    rating: 4.6,
    reviews: 68,
    price: "₹600-2000",
    workers: 21,
  },
  {
    id: 16,
    title: "Cook Services",
    icon: "fa-utensils",
    description: "Professional cooks for daily meals or special occasions.",
    category: "domestic",
    rating: 4.9,
    reviews: 145,
    price: "₹300-800/day",
    workers: 36,
  },
  {
    id: 17,
    title: "Washing Machine Repair",
    icon: "fa-soap",
    description: "Expert technicians for all washing machine brands.",
    category: "repairs",
    rating: 4.7,
    reviews: 83,
    price: "₹700-1800",
    workers: 23,
  },
  {
    id: 18,
    title: "Car Detailing",
    icon: "fa-car",
    description: "Professional interior and exterior car cleaning services.",
    category: "repairs",
    rating: 4.8,
    reviews: 97,
    price: "₹1000-3000",
    workers: 28,
  },
];

const categories = [
  { key: "all", label: "All Services" },
  { key: "domestic", label: "Domestic Help" },
  { key: "repairs", label: "Repairs" },
  { key: "event", label: "Event Help" },
  { key: "movers", label: "Movers" },
];

const faqItems = [
  {
    question: "Are all workers background verified?",
    answer:
      "Yes, all workers on Trustyhands undergo a thorough background verification process. This includes identity verification, criminal checks, and professional reference checks.",
  },
  {
    question: "How does payment work?",
    answer:
      "Secure payment processing. Pay via card or wallet. Payment is released after you confirm satisfactory completion.",
  },
  {
    question: "Can I reschedule my booking?",
    answer:
      "Yes, reschedule up to 24 hours before appointment. Use the bookings panel in the app or web dashboard.",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "Contact support within 48 hours and we will arrange resolution at no extra cost.",
  },
  {
    question: "How are workers rated and reviewed?",
    answer:
      "After each job, customers rate and review workers. This feedback appears on worker profiles for future customers.",
  },
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popularity");
  const [modalService, setModalService] = useState(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);

  const filteredServices = useMemo(() => {
    let result = servicesData;
    if (selectedCategory !== "all") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(lowerSearch) ||
          s.description.toLowerCase().includes(lowerSearch),
      );
    }

    const sorted = [...result];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (
            parseInt(a.price.replace(/\D/g, "")) -
            parseInt(b.price.replace(/\D/g, ""))
          );
        case "price-high":
          return (
            parseInt(b.price.replace(/\D/g, "")) -
            parseInt(a.price.replace(/\D/g, ""))
          );
        case "rating":
          return b.rating - a.rating;
        case "popularity":
        default:
          return b.reviews - a.reviews;
      }
    });

    return sorted;
  }, [selectedCategory, searchTerm, sortBy]);

  const openModal = (serviceId) => {
    const service = servicesData.find((s) => s.id === serviceId);
    setModalService(service ?? null);
  };

  const closeModal = () => setModalService(null);

  const toggleFaq = (index) =>
    setActiveFaqIndex((prev) => (prev === index ? null : index));

  return (
    <div className="srv-page">
      <section className="srv-hero-section">
        <div className="container">
          <h1>Our Premium Services</h1>
          <p>Find trusted professionals for all your home service needs</p>
        </div>
      </section>

      <section className="srv-search-filter srv-section">
        <div className="container">
          <div className="srv-search-container">
            <div className="srv-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a service (e.g. 'electrician')"
              />
            </div>
            <div className="srv-sort-filter">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="price-low">Sort by: Price (Low to High)</option>
                <option value="price-high">Sort by: Price (High to Low)</option>
                <option value="rating">Sort by: Highest Rating</option>
              </select>
            </div>
          </div>

          <div className="srv-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.key}
                className={`srv-category-tab ${selectedCategory === cat.key ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="srv-section">
        <div className="container">
          <div className="srv-services-grid">
            {filteredServices.length === 0 ? (
              <p className="no-results" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
                No services found. Try matching other keywords.
              </p>
            ) : (
              filteredServices.map((service) => (
                <div key={service.id} className="srv-service-card">
                  <div>
                    <div className="srv-service-icon">
                      <i className={`fas ${service.icon}`}></i>
                    </div>
                    <h3 className="srv-service-title">{service.title}</h3>
                    <p className="srv-service-desc">{service.description}</p>
                  </div>
                  <button
                    className="srv-view-info-btn"
                    onClick={() => openModal(service.id)}
                  >
                    View Info
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="srv-join-worker srv-section">
        <div className="container">
          <h2>Want to Offer Your Services?</h2>
          <p>
            Join thousands of skilled professionals earning competitive income
            by offering your expertise to our community of customers.
          </p>
          <button className="btn btn-secondary">Join as a Worker</button>
        </div>
      </section>

      <section className="srv-testimonials srv-section">
        <div className="container">
          <h2 className="section-title">Customer Testimonials</h2>
          <div className="srv-testimonial-container">
            <div className="srv-testimonial">
              <div className="srv-testimonial-header">
                <i className="fas fa-user"></i>
                <h3>Plumbing Services</h3>
              </div>
              <p>
                "Trustyhands saved me when my kitchen sink burst on a Sunday!
                Found a plumber within 20 minutes who fixed everything
                professionally. The platform is incredibly easy to use and the
                quality of service exceeded my expectations."
              </p>
              <div className="srv-client">
                <div className="srv-client-avatar">SJ</div>
                <div className="srv-client-info">
                  <h4>Sarah Johnson</h4>
                  <p>Homeowner in New York</p>
                </div>
              </div>
            </div>
            <div className="srv-testimonial">
              <div className="srv-testimonial-header">
                <i className="fas fa-broom"></i>
                <h3>Cleaning Services</h3>
              </div>
              <p>
                "The deep cleaning service was exceptional! The team arrived on
                time, brought all their own supplies, and left my home spotless.
                I've booked them for monthly cleanings now. Highly recommend
                Trustyhands for all home services!"
              </p>
              <div className="srv-client">
                <div className="srv-client-avatar">MC</div>
                <div className="srv-client-info">
                  <h4>Michael Chen</h4>
                  <p>Busy Professional</p>
                </div>
              </div>
            </div>
            <div className="srv-testimonial">
              <div className="srv-testimonial-header">
                <i className="fas fa-tools"></i>
                <h3>Electrical Work</h3>
              </div>
              <p>
                "I needed several electrical outlets installed in my home
                office. The electrician from Trustyhands was knowledgeable,
                efficient, and cleaned up after himself. Pricing was transparent
                and fair. Will definitely use again!"
              </p>
              <div className="srv-client">
                <div className="srv-client-avatar">ER</div>
                <div className="srv-client-info">
                  <h4>Emma Rodriguez</h4>
                  <p>Remote Worker</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="srv-faqs srv-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="srv-faq-container">
            {faqItems.map((faq, index) => (
              <div key={index} className="srv-faq-item">
                <div className="srv-faq-question" onClick={() => toggleFaq(index)}>
                  {faq.question}
                  <i
                    className={`fas fa-chevron-${activeFaqIndex === index ? "up" : "down"}`}
                  ></i>
                </div>
                <div
                  className={`srv-faq-answer ${activeFaqIndex === index ? "active" : ""}`}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {modalService && (
        <div className="modal" style={{ display: 'flex' }} onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(event) => event.stopPropagation()}
            style={{ width: '90%', maxWidth: '600px', padding: 0 }}
          >
            <span className="close" style={{ top: '15px', right: '15px', zIndex: 10, color: 'white' }} onClick={closeModal}>
              &times;
            </span>
            <div className="srv-modal-header">
              <h2>{modalService.title}</h2>
              <div className="rating">
                <i className="fas fa-star"></i> {modalService.rating} (
                {modalService.reviews} Reviews)
              </div>
            </div>
            <div className="srv-modal-body">
              <div className="srv-service-details">
                <div className="srv-service-details-img">
                  <i className={`fas ${modalService.icon}`}></i>
                </div>
                <div className="srv-service-details-info">
                  <p>{modalService.description}</p>

                  <div className="srv-details-meta">
                    <div className="srv-meta-item">
                      <div className="srv-meta-value">{modalService.workers}+</div>
                      <div className="srv-meta-label">Professionals</div>
                    </div>
                    <div className="srv-meta-item">
                      <div className="srv-meta-value">{modalService.price}</div>
                      <div className="srv-meta-label">Price Range</div>
                    </div>
                    <div className="srv-meta-item">
                      <div className="srv-meta-value">24/7</div>
                      <div className="srv-meta-label">Availability</div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="srv-book-now-btn"
                onClick={() => alert("Please log in to book services.")}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
