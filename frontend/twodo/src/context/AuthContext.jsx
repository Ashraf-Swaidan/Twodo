import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  console.log(user);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

// Inside AuthProvider
useEffect(() => {
  console.log("Checking token on mount");
  const token = localStorage.getItem('token');
  if (token) {
    console.log("Token found:", token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get(`${API_URL}/me`)
      .then(response => {
        console.log("User data fetched:", response.data);
        setUser(response.data);
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  } else {
    console.log("No token found");
    setLoading(false);
  }
}, []);

// Inside login function
const login = async (email, password) => {
  console.log("Login function called with:", email);
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log("Login response:", response);
    const token = response.data.token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(response.data.user);
    console.log("User state set:", response.data.user);
    navigate('/todos'); // Ensure navigate is called after setting user
  } catch (error) {
    console.error("Login error:", error);
    if (error.response && error.response.status === 401) {
      throw new Error('Invalid credentials');
    }
    throw new Error('An error occurred while logging in. Please try again.');
  }
};

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      navigate('/login')
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  // Avatar upload function
  const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await axios.post(`${API_URL}/upload-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Update the user's avatar in the state
      setUser((prevUser) => ({
        ...prevUser,
        avatar: response.data.avatar, // Update avatar in user state
      }));
      return response.data;
    } catch (error) {
      console.error('Avatar upload failed:', error);
      throw new Error('Failed to upload avatar. Please try again.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading, uploadAvatar }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
