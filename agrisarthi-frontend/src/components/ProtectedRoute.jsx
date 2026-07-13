import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // Render the children components if authenticated
  return children;
};

export default ProtectedRoute;
