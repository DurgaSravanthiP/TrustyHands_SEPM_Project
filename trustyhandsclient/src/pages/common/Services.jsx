import React, { useState, useMemo } from "react";
import "../../styles/Services.css";

const servicesData = [
  {
    id: 1,
    title: "Plumbing Services",
    icon: "fa-faucet",
    description: "Expert solutions for leaks, installations, and all plumbing needs.",
    category: "repairs",
  },
  {
    id: 2,
    title: "Electrical Work",
    icon: "fa-bolt",
    description: "Certified electricians for installations, repairs and maintenance.",
    category: "repairs",
  },
  {
    id: 3,
    title: "Deep Cleaning",
    icon: "fa-broom",
    description: "Thorough cleaning for homes, offices and commercial spaces.",
    category: "domestic",
  },
  {
    id: 4,
    title: "Carpentry",
    icon: "fa-hammer",
    description: "Custom woodwork, furniture repair and installations.",
    category: "repairs",
  },
  {
    id: 5,
    title: "Painting Services",
    icon: "fa-paint-roller",
    description: "Interior and exterior painting for homes and businesses.",
    category: "repairs",
  },
  {
    id: 6,
    title: "AC Service",
    icon: "fa-wind",
    description: "Maintenance, repair and installation for all AC units.",
    category: "repairs",
  },
  {
    id: 7,
    title: "Packers & Movers",
    icon: "fa-boxes",
    description: "Professional packing and relocation services.",
    category: "movers",
  },
  {
    id: 8,
    title: "Kitchen Cleaning",
    icon: "fa-utensils",
    description: "Deep cleaning for kitchens and appliances.",
    category: "domestic",
  },
  {
    id: 9,
    title: "Event Staffing",
    icon: "fa-glass-cheers",
    description: "Professional staff for events, parties and gatherings.",
    category: "event",
  },
  {
    id: 10,
    title: "Home Sanitization",
    icon: "fa-hand-sparkles",
    description: "Professional sanitization for healthy living.",
    category: "domestic",
  },
  {
    id: 11,
    title: "Babysitting",
    icon: "fa-baby",
    description: "Reliable childcare professionals for your family.",
    category: "domestic",
  },
  {
    id: 12,
    title: "Gardening Services",
    icon: "fa-leaf",
    description: "Landscaping, lawn care and garden maintenance.",
    category: "domestic",
  },
  {
    id: 13,
    title: "Bathroom Cleaning",
    icon: "fa-shower",
    description: "Deep cleaning and sanitization for bathrooms.",
    category: "domestic",
  },
  {
    id: 14,
    title: "Fridge Repair",
    icon: "fa-snowflake",
    description: "Expert repair for all refrigerator models.",
    category: "repairs",
  },
  {
    id: 15,
    title: "TV Repair",
    icon: "fa-tv",
    description: "Professional repair for all television types.",
    category: "repairs",
  },
  {
    id: 16,
    title: "Cook Services",
    icon: "fa-utensils",
    description: "Professional cooks for daily meals or special occasions.",
    category: "domestic",
  },
  {
    id: 17,
    title: "Washing Machine Repair",
    icon: "fa-soap",
    description: "Expert technicians for all washing machine brands.",
    category: "repairs",
  },
  {
    id: 18,
    title: "Car Detailing",
    icon: "fa-car",
    description: "Professional interior and exterior car cleaning services.",
    category: "repairs",
  },
];

const categories = [
  { key: "all", label: "All Services" },
  { key: "domestic", label: "Domestic Help" },
  { key: "repairs", label: "Repairs" },
  { key: "event", label: "Event Help" },
  { key: "movers", label: "Movers" },
];

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
          s.description.toLowerCase().includes(lowerSearch)
      );
    }
    return result;
  }, [selectedCategory, searchTerm]);

  return (
    <div className="srv-page">
      <section className="srv-hero-section">
        <div className="container">
          <h1>Our Premium Services</h1>
          <p>Explore our wide range of trusted home and professional services</p>
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
                placeholder="Search for a service or category..."
              />
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
            {filteredServices.map((service) => (
              <div key={service.id} className="srv-service-card">
                <div className="srv-service-icon">
                  <i className={`fas ${service.icon}`}></i>
                </div>
                <h3 className="srv-service-title">{service.title}</h3>
                <p className="srv-service-desc">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="srv-join-worker srv-section">
        <div className="container">
          <h2>Trustyhands Professional Marketplace</h2>
          <p>Connect with verified experts for all your domestic and technical needs.</p>
        </div>
      </section>
    </div>
  );
};

export default Services;
