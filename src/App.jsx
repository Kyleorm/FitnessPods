import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import BottomNav from './components/BottomNav'
import Splash from './screens/Splash'
import Welcome from './screens/Welcome'
import Login from './screens/Login'
import Signup from './screens/Signup'
import Home from './screens/Home'
import Pods from './screens/Pods'
import Book from './screens/Book'
import BookConfirm from './screens/BookConfirm'
import Shop from './screens/Shop'
import Profile from './screens/Profile'

const NAV_ROUTES = ['/', '/home', '/pods', '/book', '/shop', '/profile']

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--w10)', borderTopColor: 'var(--red)', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  return user ? children : <Navigate to="/welcome" replace />
}

export default function App() {
  const { pathname } = useLocation()
  const showNav = NAV_ROUTES.some(r => pathname === r)

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/splash"   element={<Splash />} />
        <Route path="/welcome"  element={<Welcome />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/signup"   element={<Signup />} />

        {/* Protected routes */}
        <Route path="/"         element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/home"     element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/pods"     element={<ProtectedRoute><Pods /></ProtectedRoute>} />
        <Route path="/book"     element={<ProtectedRoute><Book /></ProtectedRoute>} />
        <Route path="/book/confirm" element={<ProtectedRoute><BookConfirm /></ProtectedRoute>} />
        <Route path="/shop"     element={<ProtectedRoute><Shop /></ProtectedRoute>} />
        <Route path="/profile"  element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
      {showNav && <BottomNav />}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}
