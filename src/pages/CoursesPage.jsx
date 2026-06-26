import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      const { data } = await supabase
        .from('courses')
        .select('*, lessons(count)')
        .eq('is_published', true)
        .order('sort_order')
      if (active) {
        setCourses(data || [])
        setLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  if (loading) return <div style={styles.loading}>Loading courses…</div>

  return (
    <div style={styles.page}>
      <div style={styles.head}>
        <h1 style={styles.h1}>📚 Courses</h1>
        <p style={styles.sub}>Food as Medicine, fitness, mindset, finances and more.</p>
      </div>

      {courses.length === 0 ? (
        <div style={styles.empty}>
          No courses published yet. Your learning library will appear here.
        </div>
      ) : (
        <div style={styles.grid}>
          {courses.map((c) => {
            const count = c.lessons?.[0]?.count ?? 0
            return (
              <div key={c.id} style={styles.card}>
                <div
                  style={{
                    ...styles.cover,
                    background: c.cover_url
                      ? `center/cover no-repeat url(${c.cover_url})`
                      : 'linear-gradient(135deg, #2563eb, #1e293b)',
                  }}
                />
                <div style={styles.title}>{c.title}</div>
                <p style={styles.desc}>{c.description}</p>
                <div style={styles.cardFoot}>
                  <span style={styles.tag}>{count} lessons</span>
                  <button style={styles.ghostBtn}>Open</button>
                </div>
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  },
  card: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: 16,
    padding: '1.2rem',
    boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
  },
  cover: { height: 110, borderRadius: 12, marginBottom: '0.8rem' },
  title: { fontWeight: 700, fontSize: '1.05rem', color: '#1f2937' },
  desc: { color: '#475569', fontSize: '0.9rem', margin: '0.5rem 0', minHeight: 44 },
  cardFoot: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  tag: {
    fontSize: '0.72rem',
    fontWeight: 700,
    padding: '0.18rem 0.5rem',
    borderRadius: 999,
    background: '#eef2ff',
    color: '#7c3aed',
  },
  ghostBtn: {
    padding: '0.55rem 0.9rem',
    border: '1px solid #e2e8f0',
    borderRadius: 10,
    fontWeight: 700,
    color: '#475569',
    cursor: 'pointer',
    background: '#fff',
  },
}

