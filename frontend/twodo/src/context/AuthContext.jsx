import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

const API_URL = `${BASE_API_URL}/auth`;


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


// Inside AuthProvider
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    axios.get(`${API_URL}/me`)
      .then(response => {
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

const checkAvailability = async (field, value) => {
  try {
    const response = await axios.get(`${API_URL}/check-availability`, {
      params: { [field]: value },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to check availability');
  }
};

// Inside login function
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const token = response.data.token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(response.data.user);
    
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
      
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
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

   const getUserDetails = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user details');
  }
};

  return (
    <AuthContext.Provider value={{ user, register, login, logout, loading, uploadAvatar, getUserDetails, checkAvailability }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
