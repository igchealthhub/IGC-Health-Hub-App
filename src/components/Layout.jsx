import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

// App shell for all signed-in pages: fixed navbar on top, page content below.
// The actual page renders into <Outlet /> via the nested routes in App.jsx.
export default function Layout() {
  return (
    <div style={styles.shell}>
      <Navbar />
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

const styles = {
  shell: {
    minHeight: '100vh',
    background: '#f1f5f9',
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    color: '#1f2937',
  },
  main: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '1.4rem 1rem',
    width: '100%',
    boxSizing: 'border-box',
  },
}

