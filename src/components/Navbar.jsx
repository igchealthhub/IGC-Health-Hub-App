import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/games', label: 'Games' },
    { to: '/challenges', label: 'Challenges' },
    { to: '/courses', label: 'Courses' },
    { to: '/groups', label: 'Groups' },
    { to: '/profile', label: 'Profile' },
  ]
  if (isAdmin) links.push({ to: '/admin', label: 'Admin' })

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  const linkStyle = ({ isActive }) => ({
    ...styles.link,
    ...(isActive ? styles.linkActive : null),
  })

  return (
    <header style={styles.bar}>
      <div style={styles.inner}>
        {/* Brand */}
        <div style={styles.brand}>
          <span style={styles.mark}>H</span>
          <span style={styles.brandText}>IGC Health Hub</span>
        </div>

        {/* Nav links (scroll horizontally on small screens) */}
        <nav style={styles.nav}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} style={linkStyle}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side: points + logout */}
        <div style={styles.right}>
          <span style={styles.points}>⭐ {profile?.points ?? 0}</span>
          <button style={styles.logout} onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  )
}

const styles = {
  bar: {
    background: '#1e293b',
    position: 'sticky',
    top: 0,
    zIndex: 30,
    boxShadow: '0 2px 10px rgba(15,23,42,0.15)',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.6rem 1rem',
    flexWrap: 'wrap',
  },
  brand: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff', fontWeight: 800 },
  mark: {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'linear-gradient(135deg, #38bdf8, #f472b6)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 900,
    flexShrink: 0,
  },
  brandText: { fontSize: '0.98rem', whiteSpace: 'nowrap' },
  nav: {
    display: 'flex',
    gap: '0.25rem',
    flex: 1,
    overflowX: 'auto',
    padding: '0.1rem',
  },
  link: {
    color: '#cbd5e1',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '0.9rem',
    padding: '0.45rem 0.7rem',
    borderRadius: 8,
    whiteSpace: 'nowrap',
  },
  linkActive: {
    color: '#fff',
    background: 'rgba(56,189,248,0.18)',
  },
  right: { display: 'flex', alignItems: 'center', gap: '0.6rem' },
  points: {
    background: 'rgba(250,204,21,0.15)',
    color: '#facc15',
    fontWeight: 700,
    fontSize: '0.82rem',
    padding: '0.3rem 0.6rem',
    borderRadius: 999,
    whiteSpace: 'nowrap',
  },
  logout: {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.25)',
    borderRadius: 8,
    padding: '0.45rem 0.8rem',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
}

