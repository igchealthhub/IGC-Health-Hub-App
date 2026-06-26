import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

export default function GroupsPage() {
  const { user } = useAuth()
  const [groups, setGroups] = useState([])
  const [memberships, setMemberships] = useState({}) // group_id -> true
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  const load = useCallback(async () => {
    const [{ data: gs }, { data: gm }] = await Promise.all([
      supabase.from('groups').select('*, group_members(count)').order('name'),
      supabase.from('group_members').select('group_id').eq('user_id', user.id),
    ])
    const map = {}
    ;(gm || []).forEach((m) => {
      map[m.group_id] = true
    })
    setGroups(gs || [])
    setMemberships(map)
    setLoading(false)
  }, [user.id])

  useEffect(() => {
    load()
  }, [load])

  const toggle = async (groupId, joined) => {
    setBusyId(groupId)
    if (joined) {
      await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id)
    } else {
      await supabase
        .from('group_members')
        .insert({ group_id: groupId, user_id: user.id, role: 'member' })
    }
    await load()
    setBusyId(null)
  }

  if (loading) return <div style={styles.loading}>Loading groups…</div>

  return (
    <div style={styles.page}>
      <div style={styles.head}>
        <h1 style={styles.h1}>👥 Groups</h1>
        <p style={styles.sub}>Find your people. Financial Freedom, Fitness, Faith and more.</p>
      </div>

      {groups.length === 0 ? (
        <div style={styles.empty}>No groups yet. Communities will appear here.</div>
      ) : (
        <div style={styles.grid}>
          {groups.map((g) => {
            const joined = !!memberships[g.id]
            const count = g.group_members?.[0]?.count ?? 0
            return (
              <div key={g.id} style={styles.card}>
                <div style={styles.cardTop}>
                  <div style={styles.avatar}>{g.name?.[0]?.toUpperCase() || '#'}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={styles.title}>{g.name}</div>
                    <span style={styles.tag}>{count} members</span>
                  </div>
                </div>
                <p style={styles.desc}>{g.description}</p>
                <button
                  style={joined ? styles.ghostBtn : styles.primaryBtn}
                  disabled={busyId === g.id}
                  onClick={() => toggle(g.id, joined)}
                >
                  {busyId === g.id ? '…' : joined ? 'Leave group' : 'Join group'}
                </button>
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
  cardTop: { display: 'flex', gap: '0.8rem', alignItems: 'center' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #38bdf8, #a78bfa)',
    color: '#fff',
    display: 'grid',
    placeItems: 'center',
    fontSize: '1.3rem',
    fontWeight: 800,
    flexShrink: 0,
  },
  title: { fontWeight: 700, fontSize: '1.05rem', color: '#1f2937' },
  tag: {
    display: 'inline-block',
    marginTop: 4,
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '0.18rem 0.5rem',
    borderRadius: 999,
    background: '#eef2ff',
    color: '#7c3aed',
  },
  desc: { color: '#475569', fontSize: '0.9rem', margin: '0.7rem 0' },
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
  ghostBtn: {
    width: '100%',
    padding: '0.7rem 1rem',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    fontWeight: 700,
    color: '#475569',
    cursor: 'pointer',
    background: '#fff',
  },
}

