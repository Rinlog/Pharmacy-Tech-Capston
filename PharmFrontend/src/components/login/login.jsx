import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import AuthContext from '@components/login/AuthContext.jsx';
import './Login.css'
import $ from 'jquery';
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const Login = () => {
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
                },
                body: JSON.stringify({ Email: email, Password: password }),
            });
            const data = await response.json();
            if (data.message === "Wrong email or password entered.") {
                alert(data.message);
            } else if (data.message) {
                alert(data.message);
            } else {
                setCookie('user', data.data.userId, { path: '/', sameSite: 'none', secure: true});
                setCookie('admin', data.data.admin, { path: '/', sameSite: 'none', secure: true});

                // Update auth state
                setAuthState({
                    loggedIn: true,
                    isAdmin: data.data.admin === 'Y'
                });

                // Navigate to home page
                navigate('/home');
            }
        } catch (error) {
            //console.log(error); //debugging
            alert("Could not log you in at this time. Please contact the system administrator.");
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        let email = prompt("Please enter your email address to reset your password:");
        if (email) {
            try {
                const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/User/resetrequest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Email: email }),
                });
                const data = await response.json();
                if (data.message) {
                    alert(data.message);
                } else {
                    alert("Password reset instructions have been sent to your email.");
                }
            } catch (error) {
                //console.log(error); //debugging
                alert("Could not process your request at this time. Please contact the system administrator.");
            }
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)} />
                {emailError && <div style={{ color: 'red', fontSize: '12px' }}>{emailError}</div>}
                <br /><br />
                <label className='input-label'>Password:</label>
                <input
                    className="text-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)} />
                {passwordError && <div style={{ color: 'red', fontSize: '12px' }}>{passwordError}</div>}
                <br /><br />
                <button className="button" type="submit">Login</button>
            </form>

            <form className='regular-form'>
                <div className='d-flex justify-content-center'>
                    <h3>Don't have an account?</h3> 
                    <button className="button" onClick={() => navigate('/signup')}>Sign Up</button>
                </div>
                <div className='d-flex justify-content-center'>
                    <h3>Forgot your password?</h3> 
                    <button className="button" onClick={handleForgotPassword}>Reset Password</button>
                </div>
            </form>
        </div>
    );
};

export default Login;