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
import printOrder from './components/printorder/printorder.jsx';

import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import { AuthProvider } from '@components/login/AuthContext.jsx';
import ProtectedRoute from '@components/login/ProtectedRoute.jsx';

function App() {
    return (
        <div className='page-container'>
            <AuthProvider>
                <CookiesProvider>
                    <Router>
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Navigate to="/home" replace />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/confirmation/:code/:userID" element={<Confirmation />} />
                            <Route path="/confirmation/" element={<Navigate to="/home" replace />} />
                            <Route path="/passwordreset/:code/:userID" element={<PasswordReset />} />
                            <Route path="/passwordreset/" element={<Navigate to="/home" replace />} />
                            <Route path="/home" element={<ProtectedRoute component={Home} />} />
                            <Route path="/patients" element={<ProtectedRoute component={Patients} />} />
                            <Route path="/orders" element={<ProtectedRoute component={Orders} />} />
                            <Route path="/physicians" element={<ProtectedRoute component={Physicians} />} />
                            <Route path="/drugs" element={<ProtectedRoute component={Drugs} />} />
                            <Route path="/printorder" element={<ProtectedRoute component={printOrder}/>} />
                            <Route path="/verification" element={<ProtectedRoute component={Verification} />} />
                            <Route path="/usermanagement" element={<ProtectedRoute component={UserManagement} adminRequired />} />
                            <Route path="/logs" element={<ProtectedRoute component={Logs} adminRequired />} />
                        </Routes>
                    </Router>
                </CookiesProvider>
            </AuthProvider>
        </div>
    );
}

export default App;