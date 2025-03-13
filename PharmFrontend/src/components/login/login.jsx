import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import AuthContext from '@components/login/AuthContext.jsx';
import $ from 'jquery';

const ApiAccess = import.meta.env.VITE_APIAccess
import ResetPasswordModal from '../modals/resetPasswordModal';
import AlertModal from '../modals/alertModal';
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const Login = () => {

    // Modal things
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [cookies, setCookie] = useCookies(['user', 'admin']);
    const { setAuthState } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Email is required');
            return;
        }

        if (!password) {
            setPasswordError('Password is required');
            return;
        }

        try {
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/User/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify({ Email: email, Password: password }),
            });
            const data = await response.json();
            if (data.message === "Wrong email or password entered.") {
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            } else if (data.message) {
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            } else {
                setCookie('user', data.data.userId, { path: '/', sameSite: 'none', secure: true});
                setCookie('admin', data.data.admin, { path: '/', sameSite: 'none', secure: true});

                // Update auth state
                setAuthState({
                    loggedIn: true,
                    isAdmin: data.data.admin === 'Y'
                });

            }
        } catch (error) {
            //console.log(error); //debugging
            setAlertMessage("Could not log you in at this time. Please contact the system administrator.");
            setIsAlertModalOpen(true);
        }
    };

    return (
        <div>
            <form className='regular-form' onSubmit={handleLogin}>
                <h1>Welcome to the PharmTech System!</h1>
                <h3>Please login to continue</h3>
                <br /><br />
                <label className='input-label'>Email:</label>
                <input
                    className="text-input"
                    type="text"
                    qa-id="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                {emailError && <div style={{ color: 'red', fontSize: '12px' }}>{emailError}</div>}
                <br /><br />
                <label className='input-label'>Password:</label>
                <input
                    className="text-input"
                    type="password"
                    qa-id="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                {passwordError && <div style={{ color: 'red', fontSize: '12px' }}>{passwordError}</div>}
                <br /><br />
                <button className="button" type="submit" qa-id="Login">Login</button>
            </form>

            <form className='regular-form'>
                <div className='d-flex justify-content-center'>
                    <h3>Don't have an account?</h3> 
                    <button className="button" onClick={() => navigate('/signup')} qa-id="SignUp">Sign Up</button>
                </div>
                <div className='d-flex justify-content-center'>
                <h3>Forgot your password?</h3> 
                <button type="button" className="button" onClick={() => setIsResetModalOpen(true)} qa-id="ResetPass">
                    Reset Password
                    </button>
                    <ResetPasswordModal
                        isOpen={isResetModalOpen} 
                        onClose={() => setIsResetModalOpen(false)}
                    />
                </div>
            </form>
            <AlertModal
                isOpen={isAlertModalOpen}
                message={alertMessage}
                onClose={() => {setIsAlertModalOpen(false)}}
            />
            
        </div>
    );
};

export default Login;