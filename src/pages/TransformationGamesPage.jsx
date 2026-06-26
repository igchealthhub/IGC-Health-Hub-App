import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

// Transformation Games tier ladder (Spark -> Legend).
const TIERS = [
  { key: 'spark', label: 'Spark', min: 0, color: '#38bdf8' },
  { key: 'flame', label: 'Flame', min: 500, color: '#f59e0b' },
  { key: 'champion', label: 'Champion', min: 1500, color: '#f472b6' },
  { key: 'transformer', label: 'Transformer', min: 3500, color: '#a78bfa' },
  { key: 'legend', label: 'Legend', min: 7500, color: '#2dd4bf' },
]

function tierForPoints(points = 0) {
  let current = TIERS[0]
  for (const t of TIERS) {
    if (points >= t.min) current = t
  }
  const idx = TIERS.indexOf(current)
  const next = TIERS[idx + 1] || null
  const progress = next
    ? Math.round(((points - current.min) / (next.min - current.min)) * 100)
    : 100
  return { current, next, progress }
}

export default function TransformationGamesPage() {
  const { user, profile } = useAuth()
  const points = profile?.points ?? 0
  const { current, next, progress } = tierForPoints(points)

  const [leaders, setLeaders] = useState([])

  useEffect(() => {
    let active = true
    async function load() {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, points')
        .order('points', { ascending: false })
        .limit(10)
      if (active) setLeaders(data || [])
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <div style={styles.page}>
      <div style={styles.head}>
        <h1 style={styles.h1}>🏆 Transformation Games</h1>
        <p style={styles.sub}>Earn points, climb the tiers, compete for the prize pool.</p>
      </div>

      {/* Current tier */}
      <div style={styles.tierCard}>
        <div style={{ ...styles.glow, background: current.color }} />
        <div style={styles.tierLabel}>Your Transformation Tier</div>
        <div style={{ ...styles.tierName, color: current.color }}>{current.label}</div>
        <div style={styles.track}>
          <div style={{ ...styles.fill, width: `${progress}%` }} />
        </div>
        <div style={styles.tierFoot}>
          {next ? `${next.min - points} pts to ${next.label}` : 'Top tier reached — Legend 🎉'}
        </div>
      </div>

      {/* Tier ladder */}
      <h2 style={styles.h2}>Tier ladder</h2>
      <div style={styles.ladder}>
        {TIERS.map((t) => {
          const reached = points >= t.min
          const isCurrent = t.key === current.key
          return (
            <div
              key={t.key}
              style={{
                ...styles.tier,
                borderColor: isCurrent ? t.color : '#e2e8f0',
                borderWidth: isCurrent ? 2 : 1,
                opacity: reached ? 1 : 0.55,
              }}
            >
              <div style={{ ...styles.tierIcon, background: `${t.color}22`, color: t.color }}>
                {reached ? '✓' : '🔒'}
              </div>
              <strong>{t.label}</strong>
              <div style={styles.muted}>{t.min}+ pts</div>
            </div>
          )
        })}
      </div>

      {/* Leaderboard */}
      <h2 style={styles.h2}>Leaderboard</h2>
      <div style={styles.card}>
        {leaders.length === 0 ? (
          <p style={styles.muted}>No members ranked yet.</p>
        ) : (
          leaders.map((m, i) => (
            <div key={m.id} style={styles.row}>
              <span style={styles.rank}>{i + 1}</span>
              <span style={{ flex: 1, fontWeight: 600 }}>
                {m.full_name || 'Member'}
                {m.id === user.id && <span style={styles.you}>You</span>}
              </span>
              <strong>{m.points} pts</strong>
            </div>
          ))
        )}
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
  tierCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 16,
    padding: '1.4rem',
    color: '#fff',
    background: 'linear-gradient(135deg, #1e293b, #0f172a)',
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: '50%',
    filter: 'blur(40px)',
    opacity: 0.5,
    right: -40,
    top: -60,
  },
  tierLabel: { color: '#94a3b8', fontWeight: 600, fontSize: '0.9rem' },
  tierName: { fontSize: '1.6rem', fontWeight: 800, margin: '0.1rem 0 0.6rem' },
  tierFoot: { fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.4rem' },
  track: { height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #38bdf8, #f472b6)' },
  ladder: {
    display: 'grid',
    gap: '0.8rem',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
  },
  tier: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 14,
    padding: '1rem',
    textAlign: 'center',
  },
  tierIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: 'grid',
    placeItems: 'center',
    fontSize: '1.2rem',
    margin: '0 auto 0.5rem',
  },
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '0.4rem 1.2rem',
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.8rem 0',
    borderBottom: '1px solid #f1f5f9',
  },
  rank: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: '#f1f5f9',
    display: 'grid',
    placeItems: 'center',
    fontWeight: 800,
    color: '#475569',
  },
  you: {
    marginLeft: 8,
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '0.18rem 0.5rem',
    borderRadius: 999,
    background: '#eef2ff',
    color: '#7c3aed',
  },
  muted: { color: '#475569' },
}

