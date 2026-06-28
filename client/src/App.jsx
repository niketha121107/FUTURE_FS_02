import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeadDetails from './pages/LeadDetails';
import ContactForm from './pages/ContactForm';
import './App.css';

export default function App() {
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';

  return (
    <AuthProvider>
      {!isContactPage && <Navbar />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
