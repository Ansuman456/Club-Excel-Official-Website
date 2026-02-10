import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import OurTeam from './pages/OurTeam';
import Sankalp from './pages/Sankalp';
import Recruitment from './pages/Recruitment';
import Events from './pages/Events';
import ContactUs from './pages/ContactUs';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import RegisterEvent from './pages/RegisterEvent';

// Protected Route Component
//only authenticated users allowed.
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('adminToken');
    return isAuthenticated ? children : <Navigate to="/admin-login" />;
};

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/ourteam" element={<OurTeam />} />
                    <Route path="/sankalp" element={<Sankalp />} />
                    <Route path="/recruitment" element={<Recruitment />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/contactus" element={<ContactUs />} />
                    <Route path="/register/:type/:id" element={<RegisterEvent />} />

                    {/* Admin Routes */}
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route
                        path="/admin-dashboard"
                        element={
                            <ProtectedRoute>
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
