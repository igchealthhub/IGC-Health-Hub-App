import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function ChallengesPage() {
  const { user } = useAuth()
  const [challenges, setChallenges] = useState([])
  const [entries, setEntries] = useState({}) // challenge_id -> entry row
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    const [{ data: ch }, { data: ent }] = await Promise.all([
      supabase
        .from('challenges')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false }),
      supabase.from('challenge_entries').select('*').eq('user_id', user.id),
    ])
    const map = {}
    ;(ent || []).forEach((e) => {
      map[e.challenge_id] = e
    })
    setChallenges(ch || [])
    setEntries(map)
    setLoading(false)
  }, [user.id])

  useEffect(() => {
    load()
  }, [load])

  const join = async (challengeId) => {
    setBusyId(challengeId)
    await supabase
      .from('challenge_entries')
      .insert({ challenge_id: challengeId, user_id: user.id, progress_count: 0 })
    await load()
    setBusyId(null)
  }

  // Increments progress. (Points are awarded server-side via RPC in a later phase.)
  const logProgress = async (entry) => {
    setBusyId(entry.challenge_id)
    await supabase
      .from('challenge_entries')
      .update({ progress_count: (entry.progress_count || 0) + 1 })
      .eq('id', entry.id)
    await load()
    setBusyId(null)
  }

  if (loading) return <div style={styles.loading}>Loading challenges…</div>

  return (
    <div style={styles.page}>
      <div style={styles.head}>
        <h1 style={styles.h1}>🎯 Challenges</h1>
        <p style={styles.sub}>Commit to a streak. Log your progress. Build momentum.</p>
      </div>

      {challenges.length === 0 ? (
        <div style={styles.empty}>No active challenges yet. Check back soon.</div>
      ) : (
        <div style={styles.grid}>
          {challenges.map((c) => {
            const entry = entries[c.id]
            const goal = c.goal_count || 100
            const progress = entry?.progress_count || 0
            const pct = Math.min(100, Math.round((progress / goal) * 100))
            return (
              <div key={c.id} style={styles.card}>
                <div style={styles.title}>{c.title}</div>
                <p style={styles.desc}>{c.description}</p>

                {entry ? (
                  <>
                    <div style={styles.track}>
                      <div style={{ ...styles.fill, width: `${pct}%` }} />
                    </div>
                    <div style={styles.progressRow}>
                      <span style={styles.muted}>
                        {progress} / {goal} ({pct}%)
                      </span>
                      <span style={styles.tag}>Joined</span>
                    </div>
                    <button
                      style={styles.primaryBtn}
                      disabled={busyId === c.id || progress >= goal}
                      onClick={() => logProgress(entry)}
                    >
                      {progress >= goal
                        ? 'Completed 🎉'
                        : busyId === c.id
                          ? 'Saving…'
                          : 'Log progress +'}
                    </button>
                  </>
                ) : (
                  <button
                    style={styles.primaryBtn}
                    disabled={busyId === c.id}
                    onClick={() => join(c.id)}
                  >
                    {busyId === c.id ? 'Joining…' : `Join — goal ${goal}`}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const styles = {
  page: { maxWidth: 1000, margin: '0 auto', width: '100%' },
  head: { marginBottom: '1.2rem' },
  h1: { fontSize: '1.6rem', margin: '0 0 0.25rem', color: '#1f2937' },
  sub: { color: '#475569', margin: 0 },
  loading: { display: 'grid', placeItems: 'center', minHeight: '40vh', color: '#475569', fontWeight: 600 },
  empty: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '2rem',
    textAlign: 'center',
    color: '#475569',
  },
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
  title: { fontWeight: 700, fontSize: '1.05rem', color: '#1f2937' },
  desc: { color: '#475569', fontSize: '0.9rem', margin: '0.5rem 0', minHeight: 40 },
  track: { height: 10, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #38bdf8, #f472b6)' },
  progressRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.4rem 0 0.8rem', fontSize: '0.85rem' },
  muted: { color: '#475569' },
  tag: {
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '0.18rem 0.5rem',
    borderRadius: 999,
    background: '#eef2ff',
    color: '#7c3aed',
  },
  primaryBtn: {
    width: '100%',
    padding: '0.7rem 1rem',
    border: 'none',
    borderRadius: 10,
    fontWeight: 700,
    color: '#fff',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
  },
}

