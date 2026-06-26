import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setBusy(true)
    const { data, error } = await signUp(email, password, fullName)
    setBusy(false)

    if (error) {
      setError(error.message)
      return
    }

    // If email confirmation is ON in Supabase, there is no session yet.
    if (!data.session) {
      setNotice('Check your email to confirm your account, then sign in.')
      return
    }

    // Otherwise the profile row is created by the DB trigger and we're in.
    navigate('/dashboard', { replace: true })
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.mark}>H</span>
          <span>IGC Health Hub</span>
        </div>
        <h1 style={styles.title}>Start your journey</h1>
        <p style={styles.sub}>Join the 8 F's community and the Transformation Games.</p>

        {error && <div style={styles.error}>{error}</div>}
        {notice && <div style={styles.ok}>{notice}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full name</label>
          <input
            style={styles.input}
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            required
          />

          <label style={styles.label}>Email</label>
          <input
            style={styles.input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <button style={styles.button} type="submit" disabled={busy}>
            {busy ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div style={styles.center}>
          <span style={styles.muted}>
            Already a member?{' '}
            <Link to="/login" style={styles.link}>
              Sign in
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '1.5rem',
    background:
      'radial-gradient(900px 500px at 10% -10%, rgba(56,189,248,0.25), transparent),' +
      'radial-gradient(800px 500px at 110% 110%, rgba(244,114,182,0.25), transparent),' +
      '#1e293b',
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    borderRadius: 16,
    padding: '2rem',
    boxShadow: '0 10px 40px rgba(15,23,42,0.25)',
    boxSizing: 'border-box',
  },
  logo: { display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, color: '#1f2937' },
  mark: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: 'linear-gradient(135deg, #38bdf8, #f472b6)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 900,
  },
  title: { fontSize: '1.5rem', margin: '0.9rem 0 0.25rem', color: '#1f2937' },
  sub: { color: '#475569', margin: '0 0 1.25rem', fontSize: '0.95rem' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', margin: '0.6rem 0 0.35rem' },
  input: {
    width: '100%',
    padding: '0.7rem 0.85rem',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    marginTop: '1.1rem',
    padding: '0.75rem 1rem',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#fff',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
  },
  center: { textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem' },
  link: { color: '#2563eb', fontWeight: 600, textDecoration: 'none' },
  muted: { color: '#475569' },
  error: {
    background: '#fef2f2',
    color: '#b91c1c',
    border: '1px solid #fecaca',
    borderRadius: 10,
    padding: '0.7rem 0.85rem',
    fontSize: '0.9rem',
    marginBottom: '0.9rem',
  },
  ok: {
    background: '#ecfdf5',
    color: '#047857',
    border: '1px solid #a7f3d0',
    borderRadius: 10,
    padding: '0.7rem 0.85rem',
    fontSize: '0.9rem',
    marginBottom: '0.9rem',
  },
}

