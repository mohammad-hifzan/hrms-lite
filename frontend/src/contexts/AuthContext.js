import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("access_token");
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  async function loadUser() {
    try {
      const response = await api.get("user/");
      setUser(response.data);
    } catch (error) {
      // Token might be invalid, clear it
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(username, password) {
    try {
      // Get base URL and remove /api/ if present since token endpoint is at /api/token/
      let baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/";
      // Remove trailing /api/ if present to get the server base URL
      baseURL = baseURL.replace(/\/api\/?$/, '');
      const response = await axios.post(
        `${baseURL}/api/token/`,
        { username, password }
      );
      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      await loadUser();
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || error.response?.data?.message || "Invalid username or password",
      };
    }
  }

  async function register(userData) {
    try {
      // Get base URL and remove /api/ if present
      let baseURL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api/";
      // Remove trailing /api/ if present to get the server base URL
      baseURL = baseURL.replace(/\/api\/?$/, '');
      const response = await axios.post(
        `${baseURL}/api/register/`,
        userData
      );
      const { tokens, user } = response.data;
      localStorage.setItem("access_token", tokens.access);
      localStorage.setItem("refresh_token", tokens.refresh);
      setUser(user);
      return { success: true };
    } catch (error) {
      // Handle validation errors from Django
      const errorMessages = error.response?.data;
      let errorMessage = "Registration failed";
      
      if (errorMessages) {
        // If it's an object with field errors, format them
        if (typeof errorMessages === 'object') {
          const errorArray = [];
          for (const [field, messages] of Object.entries(errorMessages)) {
            if (Array.isArray(messages)) {
              errorArray.push(`${field}: ${messages.join(', ')}`);
            } else if (typeof messages === 'string') {
              errorArray.push(`${field}: ${messages}`);
            } else if (Array.isArray(messages)) {
              errorArray.push(...messages);
            }
          }
          errorMessage = errorArray.length > 0 ? errorArray.join('; ') : errorMessage;
        } else if (typeof errorMessages === 'string') {
          errorMessage = errorMessages;
        }
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

