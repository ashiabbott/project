import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface ProtectedRouteProps {
  element: React.ReactElement;
  roles?: string[]; // Optional roles for role-based access
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  element,
  roles,
  ...rest
}) => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Route {...rest} element={element} />;
};

export default ProtectedRoute;
