import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function RegistrationPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate password match
    if (formData.password !== formData.password_confirm) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Registration failed");
    }
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 500,
          padding: 32,
          border: "1px solid #ddd",
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ marginBottom: 24, textAlign: "center" }}>HRMS Registration</h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="username"
              style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
            >
              Username *
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: 8,
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: 4,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="email"
              style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
            >
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: 8,
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: 4,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="first_name"
                style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
              >
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: 8,
                  fontSize: 16,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label
                htmlFor="last_name"
                style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
              >
                Last Name
              </label>
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: 8,
                  fontSize: 16,
                  border: "1px solid #ddd",
                  borderRadius: 4,
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
            >
              Password * (min. 8 characters)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              style={{
                width: "100%",
                padding: 8,
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: 4,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              htmlFor="password_confirm"
              style={{ display: "block", marginBottom: 8, fontWeight: "bold" }}
            >
              Confirm Password *
            </label>
            <input
              id="password_confirm"
              name="password_confirm"
              type="password"
              value={formData.password_confirm}
              onChange={handleChange}
              required
              minLength={8}
              style={{
                width: "100%",
                padding: 8,
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: 4,
                boxSizing: "border-box",
              }}
            />
          </div>

          {error && (
            <div
              style={{
                color: "red",
                marginBottom: 16,
                padding: 8,
                backgroundColor: "#ffe6e6",
                borderRadius: 4,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 12,
              fontSize: 16,
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
              marginBottom: 16,
            }}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div style={{ textAlign: "center" }}>
            <span style={{ marginRight: 8 }}>Already have an account?</span>
            <Link
              to="/login"
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

