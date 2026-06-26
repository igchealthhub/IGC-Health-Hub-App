import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth()

  const [fullName, setFullName] = useState('')
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState('')
  const [error, setError] = useState('')

  // Keep the input in sync once the profile loads.
  useEffect(() => {
    setFullName(profile?.full_name || '')
  }, [profile?.full_name])

  const handleSave = async () => {
    setSaving(true)
    setSavedMsg('')
    setError('')
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', user.id)
    setSaving(false)
    if (error) {
      setError(error.message)
      return
    }
    setSavedMsg('Saved ✓')
    await refreshProfile()
    setTimeout(() => setSavedMsg(''), 2000)
  }

  return (
    <div style={styles.page}>
      <div style={styles.head}>
        <h1 style={styles.h1}>🙂 Profile</h1>
        <p style={styles.sub}>Manage your account details.</p>
      </div>

      <div style={styles.grid}>
        {/* Account form */}
        <div style={styles.card}>
          <h3 style={styles.h3}>Account</h3>

          {error && <div style={styles.error}>{error}</div>}

          <label style={styles.label}>Full name</label>
          <input
            style={styles.input}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <label style={styles.label}>Email</label>
          <input style={{ ...styles.input, background: '#f8fafc', color: '#64748b' }} value={user?.email || ''} disabled />

          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button style={styles.button} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            {savedMsg && <span style={styles.saved}>{savedMsg}</span>}
          </div>
        </div>

        {/* Status summary */}
        <div style={styles.card}>
          <h3 style={styles.h3}>Status</h3>
          <div style={styles.statusRow}>
            <span style={styles.muted}>Points</span>
            <strong>{profile?.points ?? 0}</strong>
          </div>
          <div style={styles.statusRow}>
            <span style={styles.muted}>Current streak</span>
            <strong>{profile?.current_streak ?? 0} days</strong>
          </div>
          <div style={styles.statusRow}>
            <span style={styles.muted}>Best streak</span>
            <strong>{profile?.longest_streak ?? 0} days</strong>
          </div>
          <div style={styles.statusRow}>
            <span style={styles.muted}>Role</span>
            <strong style={{ textTransform: 'capitalize' }}>{profile?.role || 'member'}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: 1000, margin: '0 auto', width: '100%' },
  head: { marginBottom: '1.2rem' },
  h1: { fontSize: '1.6rem', margin: '0 0 0.25rem', color: '#1f2937' },
  sub: { color: '#475569', margin: 0 },
  h3: { margin: '0 0 0.8rem', fontSize: '1.05rem', color: '#1f2937' },
  grid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
  },
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '1.2rem',
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
  },
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
    padding: '0.7rem 1.1rem',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#fff',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
  },
  saved: { color: '#047857', fontWeight: 700 },
  statusRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.6rem 0',
    borderBottom: '1px solid #f1f5f9',
  },
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
}

