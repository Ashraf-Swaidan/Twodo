import React, { createContext, useState, useContext, useEffect } from 'react';

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  // Check for token on initial render and authenticate
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API_URL}/me`)
        .then(response => {
          setUser(response.data); // Set user state with the response
        })
        .catch(() => {
          logout(); // Log out on error
        })
        .finally(() => {
          setLoading(false); // Set loading to false whether it was successful or not
        });
    } else {
      setLoading(false); // If no token, set loading to false
    }
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(response.data.user);
      // Navigate to /todos after setting the user
      navigate('/todos');
    } catch (error) {
      throw new Error('Invalid credentials');
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

  const isLoggedIn = () => !!localStorage.getItem('token') && !!user;

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isLoggedIn, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
