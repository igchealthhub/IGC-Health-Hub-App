import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap any route that requires a logged-in user.
// Pass requireAdmin to also gate on the admin role.
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  // Wait for the initial session check before deciding anything.
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          color: '#475569',
          fontWeight: 600,
        }}
      >
        Loading…
      </div>
    )
  }

  // Not signed in -> send to login, remembering where they were headed.
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Signed in but not an admin -> bounce away from admin-only routes.
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
