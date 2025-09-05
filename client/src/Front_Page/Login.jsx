import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css"; // scoped styles only for login/register page

function Auth() {
  const [isRegister, setIsRegister] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const navigate = useNavigate();
  const cardRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      titleRef.current?.classList.add("lp-fade-in-down");
      cardRef.current?.classList.add("lp-pop-in");
    });
  }, []);

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Reset form state
  const resetForm = () => {
    setUser({ name: "", email: "", phone: "", address: "", password: "" });
  };

  // 🔹 Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:8000/api/login", {
        email: user.email,
        password: user.password,
      });

      if (data?.role === "admin") navigate("/admin");
      else navigate("/home");

      resetForm(); // clear inputs after login
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // 🔹 Register Handler
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/userreg", user, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Registered successfully");
      resetForm();       // clear inputs
      setIsRegister(false); // back to login form
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <div className="login-page">
      {/* 🔹 Topbar */}
      <div className="container-fluid topbar-top bg-primary lp-topbar">
        <div className="container">
          <div className="d-flex justify-content-between topbar py-2">
            <div className="d-flex align-items-center flex-shrink-0 topbar-info">
              <a href="#" className="me-4 text-secondary">
                <i className="fas fa-map-marker-alt me-2 text-dark" /> Coimbatore
              </a>
              <a href="#" className="me-4 text-secondary">
                <i className="fas fa-phone-alt me-2 text-dark" /> +01234567890
              </a>
              <a href="#" className="text-secondary">
                <i className="fas fa-envelope me-2 text-dark" /> pesticide@gmail.com
              </a>
            </div>
            <div className="text-end pe-4 me-4 border-end border-dark search-btn d-none d-md-block">
              <div className="search-form">
                <form>
                  <div className="form-group">
                    <div className="d-flex">
                      <input
                        type="search"
                        className="form-control border-0 rounded-pill"
                        name="search-input"
                        placeholder="Search Here"
                      />
                      <button type="button" className="btn">
                        <i className="fa fa-search text-dark" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="d-none d-md-flex align-items-center justify-content-center topbar-icon">
              <a href="#" className="me-4">
                <i className="fab fa-facebook-f text-dark" />
              </a>
              <a href="#" className="me-4">
                <i className="fab fa-twitter text-dark" />
              </a>
              <a href="#" className="me-4">
                <i className="fab fa-instagram text-dark" />
              </a>
              <a href="#">
                <i className="fab fa-linkedin-in text-dark" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Card wrapper */}
      <div className={`lp-wrap ${isRegister ? "show-register" : ""}`}>
        <div className="lp-card" ref={cardRef}>
          {/* Left image section */}
          <div className="lp-left">
            <img src="/img/log.avif" alt="login" />
            <div className="lp-left-overlay" />
          </div>

          {/* Right section */}
          <div className="lp-right">
            <h2 className="lp-title" ref={titleRef}>
              {isRegister ? "Create Account" : "Welcome Back"}
            </h2>

            {!isRegister ? (
              // 🔹 Login Form
              <form onSubmit={handleLogin} className="lp-form">
                <div className="lp-field">
                  <label className="lp-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    placeholder="Enter your email"
                    onChange={inputHandler}
                    required
                    className="lp-input"
                    autoComplete="off"
                  />
                </div>

                <div className="lp-field">
                  <label className="lp-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    placeholder="Enter your password"
                    onChange={inputHandler}
                    required
                    className="lp-input"
                    autoComplete="new-password"
                  />
                </div>

                <button type="submit" className="lp-btn">Login</button>
                <p className="lp-subtext">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();       // ✅ clear fields before switching
                      setIsRegister(true);
                    }}
                    className="lp-link-btn"
                  >
                    Register
                  </button>
                </p>
              </form>
            ) : (
              // 🔹 Register Form
              <form onSubmit={handleRegister} className="lp-form">
                <div className="lp-field">
                  <label className="lp-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    placeholder="Enter your name"
                    onChange={inputHandler}
                    required
                    className="lp-input"
                  />
                </div>

                <div className="lp-field">
                  <label className="lp-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    placeholder="Enter your email"
                    onChange={inputHandler}
                    required
                    className="lp-input"
                  />
                </div>

                <div className="lp-field">
                  <label className="lp-label">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    placeholder="Enter your phone"
                    onChange={inputHandler}
                    required
                    className="lp-input"
                  />
                </div>

                <div className="lp-field">
                  <label className="lp-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={user.address}
                    placeholder="Enter your address"
                    onChange={inputHandler}
                    required
                    className="lp-input"
                  />
                </div>

                <div className="lp-field">
                  <label className="lp-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    placeholder="Enter your password"
                    onChange={inputHandler}
                    required
                    className="lp-input"
                  />
                </div>

                <button type="submit" className="lp-btn">Register</button>
                <p className="lp-subtext">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      resetForm();       // ✅ clear fields before switching
                      setIsRegister(false);
                    }}
                    className="lp-link-btn"
                  >
                    Login
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 🔹 floating FX */}
      <div className="lp-fx lp-fx-1" />
      <div className="lp-fx lp-fx-2" />
      <div className="lp-fx lp-fx-3" />
    </div>
  );
}

export default Auth;
