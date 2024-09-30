import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  console.log("PrivateRoute user:", user); // Log the user state here

  if (loading) {
    return null; // Or <LoadingSpinner />
  }

  if (!user) {
    console.log("User is not authenticated, redirecting to login");
    return <Navigate to="/login" />;
  }

  return children;
};


export default PrivateRoute;
