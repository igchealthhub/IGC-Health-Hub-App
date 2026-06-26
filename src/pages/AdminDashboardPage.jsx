import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({
    members: null,
    courses: null,
    challenges: null,
    groups: null,
  })

  useEffect(() => {
    let active = true
    async function load() {
      const tables = [
        ['members', 'profiles'],
        ['courses', 'courses'],
        ['challenges', 'challenges'],
        ['groups', 'groups'],
      ]
      const out = {}
      for (const [key, table] of tables) {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        out[key] = count ?? 0
      }
      if (active) setCounts(out)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const stats = [
    { label: 'Members', value: counts.members, icon: '👤', color: '#2563eb' },
    { label: 'Courses', value: counts.courses, icon: '📚', color: '#10b981' },
    { label: 'Challenges', value: counts.challenges, icon: '🎯', color: '#db2777' },
    { label: 'Groups', value: counts.groups, icon: '👥', color: '#7c3aed' },
  ]

  return (
    <div style={styles.page}>
      <div style={styles.head}>
        <h1 style={styles.h1}>⚙️ Admin Dashboard</h1>
        <p style={styles.sub}>Overview and management. Full controls arrive in a later phase.</p>
      </div>

      <div style={styles.statGrid}>
        {stats.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, background: `${s.color}22`, color: s.color }}>
              {s.icon}
            </div>
            <div style={styles.statValue}>{s.value ?? '…'}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.h3}>Content management</h3>
          <p style={styles.muted}>
            Create and publish courses, lessons, challenges, and groups. Upload media
            and schedule Transformation Games seasons.
          </p>
        </div>
        <div style={styles.card}>
          <h3 style={styles.h3}>Members &amp; billing</h3>
          <p style={styles.muted}>
            Manage roles, view membership status, connect Stripe subscriptions, and
            export the leaderboard for the prize pool.
          </p>
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
  h3: { margin: '0 0 0.5rem', fontSize: '1.05rem', color: '#1f2937' },
  statGrid: {
    display: 'grid',
    gap: '1rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    marginBottom: '1.4rem',
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
  muted: { color: '#475569', lineHeight: 1.6 },
}

