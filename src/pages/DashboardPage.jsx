import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function DashboardPage() {
  const { user, profile, isAdmin } = useAuth()
  const [badgeCount, setBadgeCount] = useState(0)

  // Pull a live badge count; falls back to 0 if the table is empty/missing.
  useEffect(() => {
    let active = true
    async function loadBadges() {
      if (!user?.id) return
      const { count, error } = await supabase
        .from('user_badges')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
      if (active && !error) setBadgeCount(count ?? 0)
    }
    loadBadges()
    return () => {
      active = false
    }
  }, [user?.id])

  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  // Stat tiles (read from the profile + badge query).
  const stats = [
    { label: 'Points', value: profile?.points ?? 0, icon: '⭐', color: '#f59e0b' },
    { label: 'Badges', value: badgeCount, icon: '🏅', color: '#7c3aed' },
    { label: 'Streak', value: `${profile?.current_streak ?? 0} days`, icon: '🔥', color: '#db2777' },
  ]

  // Navigation cards to the main app sections.
  const sections = [
    { label: 'Transformation Games', to: '/games', icon: '🏆', color: '#38bdf8', desc: 'Earn points and climb the tiers.' },
    { label: 'Challenges', to: '/challenges', icon: '🎯', color: '#10b981', desc: '100 Walks in 100 Days and more.' },
    { label: 'Courses', to: '/courses', icon: '📚', color: '#2563eb', desc: 'Food as Medicine, fitness, mindset.' },
    { label: 'Groups', to: '/groups', icon: '👥', color: '#a78bfa', desc: 'Find your people and stay accountable.' },
    { label: 'Profile', to: '/profile', icon: '🙂', color: '#2dd4bf', desc: 'Your account and daily habits.' },
  ]

  if (isAdmin) {
    sections.push({
      label: 'Admin',
      to: '/admin',
      icon: '⚙️',
      color: '#f472b6',
      desc: 'Manage content and members.',
    })
  }

  return (
    <div style={styles.page}>
      <div style={styles.head}>
        <h1 style={styles.h1}>Hi, {firstName} 👋</h1>
        <p style={styles.sub}>Your transformation, at a glance.</p>
      </div>

      {/* Stat tiles */}
      <div style={styles.statGrid}>
        {stats.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: `${s.color}22`, color: s.color }}>
              {s.icon}
            </div>
            <div style={styles.statValue}>{s.value}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Section cards */}
      <h2 style={styles.h2}>Explore</h2>
      <div style={styles.cardGrid}>
        {sections.map((c) => (
          <Link key={c.label} to={c.to} style={styles.card}>
            <div style={{ ...styles.cardIcon, background: `${c.color}22`, color: c.color }}>
              {c.icon}
            </div>
            <div style={styles.cardTitle}>{c.label}</div>
            <div style={styles.cardDesc}>{c.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: 1000, margin: '0 auto', width: '100%' },
  head: { marginBottom: '1.2rem' },
  h1: { fontSize: '1.6rem', margin: '0 0 0.25rem', color: '#1f2937' },
  sub: { color: '#475569', margin: 0 },
  h2: { fontSize: '1.15rem', color: '#1f2937', margin: '1.6rem 0 0.8rem' },
  statGrid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  },
  statCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '1.1rem',
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
  },
  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: 'grid',
    placeItems: 'center',
    fontSize: '1.25rem',
    marginBottom: '0.5rem',
  },
  statValue: { fontSize: '1.7rem', fontWeight: 800, color: '#1f2937', lineHeight: 1 },
  statLabel: { color: '#475569', fontSize: '0.85rem', fontWeight: 600, marginTop: '0.25rem' },
  cardGrid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  },
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '1.2rem',
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
    textDecoration: 'none',
    color: '#1f2937',
    display: 'block',
  },
  cardIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    display: 'grid',
    placeItems: 'center',
    fontSize: '1.35rem',
    marginBottom: '0.6rem',
  },
  cardTitle: { fontWeight: 700, fontSize: '1.05rem' },
  cardDesc: { color: '#475569', fontSize: '0.9rem', marginTop: '0.25rem' },
}

