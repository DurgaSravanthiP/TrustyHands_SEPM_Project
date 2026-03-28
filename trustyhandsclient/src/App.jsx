import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/common/Home";
import About from "./pages/common/About";
import Services from "./pages/common/Services";
import HowItWorks from "./pages/common/HowItWorks";
import ContactUs from "./pages/common/ContactUs";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Footer from "./components/Footer";

const PlaceholderPage = ({ title }) => (
  <div className="container" style={{ padding: "60px 0" }}>
    <h2>{title}</h2>
    <p>Content for {title} will be added soon.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<PlaceholderPage title="Page Not Found" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
