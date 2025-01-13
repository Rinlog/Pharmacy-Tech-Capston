//css imports

//react imports
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useCookies} from 'react-cookie';

//page/function imports
import { NullCheck, CheckEmail, PassRequirements } from '@components/validation/basicValidation.jsx';
import { SanitizeEmail } from '@components/datasanitization/sanitization.jsx'; 


function Login() {

    //states and react methods
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    const [cookies, setCookie] = useCookies(['user', 'admin']);

    //validation
    //failures increase error count
    //form is not submitted unless there are no errors
    //validation
    const Validation = () => {
        let errors = 0;

        //null checks
        if (!NullCheck(email)) {
            setEmailError('Email is required');
            errors++;
        } else if (!CheckEmail(email)) {
            setEmailError('Invalid email format');
            errors++;
        } else {
            setEmailError('');
        }

        if (!NullCheck(password)) {
            setPasswordError('Password is required');
            errors++;
        } else if (!PassRequirements(password)) {
            setPasswordError('Password incorrect');
            errors++;
        } else {
            setPasswordError('');
        }

        return errors;
    }

    //form submission
    const handleSubmit = async (e) => {

        e.preventDefault();
        //validation check
        if (Validation() > 0) {
            return;
        }
        
        //sanitize email
        setEmail(SanitizeEmail(email));

        //api call
        try {
            const response = await fetch('https://localhost:7172/api/User/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Email: email, Password: password}),
            });
            const data = await response.json();
            if (data.message === "Wrong email or password entered.") {
                alert(data.message)
            }
            //updated new message to display if something comes back wrong
            else if (data.message) {
                alert(data.message)
            }
            else{
                alert("Login successful, redirecting.");
                setCookie('user', data.data.userId, {path: '/', sameSite: 'none', secure: true });
                setCookie('admin', data.data.admin, {path: '/', sameSite: 'none', secure: true });
                navigate('/home');
            }
            return;

        }
        catch (error) {

            console.log(error);
            alert("Could not log you in at this time. Please contact the system administrator.");
            return;

        }

    }

    const handleForgotPassword = async (e) => {

            e.preventDefault();
            
            // Open a modal to enter email and send a request to the API
            let email = prompt("Please enter your email address to reset your password:");

            if (!NullCheck(email)) {
                alert("Invalid email address, please try again.");
                return;
            }
            else {
                email = SanitizeEmail(email);
            }

            // Call the API
            try {
                const response = await fetch('https://localhost:7172/api/User/resetrequest', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Email: email }),
                });
                const data = await response.json();
                if (data.message == "Password reset email sent") alert(data.message);
                else alert(data.message);
                return;

            }
            catch (error) {

                console.log(error);
                alert("Could not send password reset link at this time. Please contact the system administrator.");
                return;

            }
    
        }


        return (
            <div>
                <form className='regular-form' onSubmit={handleSubmit}>
                    <h1>Welcome to the PharmTech System!</h1>
                    <h3>Please login to continue</h3>
                    <br></br><br></br>
                    <label className='input-label'>Email:</label>
                    <input
                        className="text-input"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                    {emailError && <div style={{ color: 'red', fontSize: '12px' }}>{emailError}</div>}
                    <br></br><br></br>
                    <label className='input-label'>Password:</label>
                    <input
                        className="text-input"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                    {passwordError && <div style={{ color: 'red', fontSize: '12px' }}>{passwordError}</div>}
                    <br></br><br></br>
                    <button className="button" type="submit">Login</button>
                </form>
    
                <form className='regular-form'>
                    <h3>Don't have an account? <button className="button" onClick={() => navigate('/signup')}>Sign Up</button></h3>
                    <h3>Forgot your password? <button className="button" onClick={handleForgotPassword}>Reset Password</button></h3>
                </form>
            </div>
        );


}

export default Login;