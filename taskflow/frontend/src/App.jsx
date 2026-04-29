import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Layout for protected pages (includes Navbar)
const AppLayout = () => (
  <>
    <Navbar />
    <main>
      <ProtectedRoute />
    </main>
  </>
);

// Redirect logged-in users away from auth pages
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
          <GuestRoute><Login /></GuestRoute>
        } />
        <Route path="/register" element={
          <GuestRoute><Register /></GuestRoute>
        } />

        {/* Protected routes */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
