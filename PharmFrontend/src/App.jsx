import { useState, useEffect } from 'react';
import Signup from '@components/signup/signup.jsx';
import Login from '@components/login/login.jsx';
import Confirmation from '@components/confirmation/confirmation.jsx';
import PasswordReset from '@components/passwordreset/passwordreset.jsx';
import Home from '@components/home/homepage.jsx';
import Navbar from '@components/navbar/navbar.jsx';
import Patients from '@components/patients/patients.jsx';
import Orders from '@components/orders/orders.jsx';
import Physicians from '@components/physicians/physicians.jsx';
import Drugs from '@components/drugs/drugs.jsx';
import UserManagement from '@components/userManagement/userManagement.jsx';
import Logs from '@components/logs/logs.jsx';
import Verification from '@components/verification/verification.jsx';
import printOrder from './components/printorder/printorder';
import Footer from './components/footer/footer';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from '@components/login/AuthContext.jsx';
import ProtectedRoute from '@components/login/ProtectedRoute.jsx';
import UnProtectedRoute from '@components/login/UnprotectedRoute';
import ManageLoginStatus from './components/login/ManageLoginStatus';

// added a spinner for screen
const LoadingScreen = () => (
    <div class="container">
    <img src="/images/heart.gif" class="human-heart" alt="human heart" />
</div>
);

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // made a small delay for page load
        setTimeout(() => setLoading(false), 1500); // 1.5 seconds
    }, []);

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <div className='page-container'>
            <AuthProvider>
                <CookiesProvider>
                    <Router>
                        <ManageLoginStatus/>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" replace />} />
                            <Route path="/signup" element={<UnProtectedRoute component={Signup}></UnProtectedRoute>} />
                            <Route path="/login" element={<UnProtectedRoute component={Login}></UnProtectedRoute>} />
                            <Route path="/confirmation/:code/:userID" element={<UnProtectedRoute component={Confirmation}></UnProtectedRoute>} />
                            <Route path="/confirmation/" element={<Navigate to="/home" replace />} />
                            <Route path="/passwordreset/:code/:userID" element={<UnProtectedRoute component={PasswordReset}></UnProtectedRoute>} />
                            <Route path="/passwordreset/" element={<Navigate to="/home" replace />} />

                            {/*Logged in sections*/}
                            <Route path="/home" element={<ProtectedRoute component={Home} />} />
                            <Route path="/patients" element={<ProtectedRoute component={Patients} />} />
                            <Route path="/orders" element={<ProtectedRoute component={Orders} />} />
                            <Route path="/physicians" element={<ProtectedRoute component={Physicians} />} />
                            <Route path="/drugs" element={<ProtectedRoute component={Drugs} />} />
                            <Route path="/printorder/:OrderID" element={<ProtectedRoute component={printOrder}/>} />
                            <Route path="/printorder/" element={<Navigate to="/home" replace />} />
                            <Route path="/verification" element={<ProtectedRoute component={Verification} />} />
                            
                            {/*admin routes*/}
                            <Route path="/usermanagement" element={<ProtectedRoute component={UserManagement} adminRequired />} />
                            <Route path="/logs" element={<ProtectedRoute component={Logs} adminRequired />} />
                        </Routes>
                        <Footer/>
                    </Router>
                </CookiesProvider>
            </AuthProvider>
        </div>
    );
}

export default App;
