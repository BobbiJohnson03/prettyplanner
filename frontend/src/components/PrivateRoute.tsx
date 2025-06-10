import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../redux/store'; // Adjust path if your store is elsewhere

const PrivateRoute: React.FC = () => {
  // Get the authentication token from your Redux store
  // Assuming `state.auth.token` holds the JWT
  const isAuthenticated = useSelector((state: RootState) => !!state.auth.token);

  // If the user is authenticated, render the child routes (e.g., DashboardPage)
  // Otherwise, navigate them to the login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
