//import pages for routing
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
//css import
import './App.css';
//React imports
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
//authorization components
import AuthProvider from '@components/login/AuthProvider.jsx';
import { CheckAuth } from '@components/login/CheckAuth';
//routing
import ProtectedRoute from '@components/login/ProtectedRoute.jsx';

function App() {

    //const { authState } = useContext(AuthContext);
    const initialAuthState = CheckAuth();

    return (

        <div className='page-container'>

            {/* Cookies */}
            <AuthProvider initialAuthState={initialAuthState}>

                {/* Cookies */}
                <CookiesProvider>

                        {/* Router object */ }
                        <Router>

                            {/* Navbar object */ }
                            <Navbar />

                                {/* Router object */}
                                <Routes>

                                    {/* Default page for a logged in user is home, default is login otherwise */}
                                        <Route path="/" element={initialAuthState.loggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />} />

                                    {/* Actual page routes based on URL */}
                                    {/* Public Routes */}

                                        {/* Signup routes to home if logged in */}
                                        <Route path="/signup" element={initialAuthState.loggedIn ? ( 
                                        <Navigate to="/home" replace /> ) : ( <Signup /> )} />

                                        {/* Login routes to home if logged in */}
                                        <Route path="/login" element={initialAuthState.loggedIn ? ( 
                                        <Navigate to="/home" replace /> ) : ( <Login /> )} />

                                        {/* Confirmation routes to home if it does not include a user and code*/}
                                        <Route path="/confirmation/:code/:userID" element={<Confirmation />} />
                                        <Route path="/confirmation/" element={<Navigate to="/home" replace />} />

                                        {/* Password reset routes to home if it does not include a user and code*/}
                                        <Route path="/passwordreset/:code/:userID" element={<PasswordReset />} />
                                        <Route path="/passwordreset/" element={<Navigate to="/home" replace />} />
                                        
                                    {/* Authenticated user routes */}

                                    <Route path="/home" element={<ProtectedRoute component={Home} />} />
                                    <Route path="/patients" element={<ProtectedRoute component={Patients} />} />
                                    <Route path="/orders" element={<ProtectedRoute component={Orders} />} />
                                    <Route path="/physicians" element={<ProtectedRoute component={Physicians} />} />
                                    <Route path="/drugs" element={<ProtectedRoute component={Drugs} />} />
                                    <Route path="/verification" element={<ProtectedRoute component={Verification} />} />
                                    
                                    {/* Admin routes */}
                                    <Route path="/usermanagement" element={<ProtectedRoute component={UserManagement} />} adminRequired />
                                    <Route path="/logs" element={<ProtectedRoute component={Logs} adminRequired />} />

                                </Routes>

                        </Router>

                </CookiesProvider>
            </AuthProvider>

        </div>

    );

}

export default App;
