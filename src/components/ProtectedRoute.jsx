import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('insafchain_token');
  const user = JSON.parse(localStorage.getItem('insafchain_user') || '{}');

  // No token — redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role check — if specific roles required
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
