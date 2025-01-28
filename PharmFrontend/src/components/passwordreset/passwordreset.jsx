import { useParams } from "react-router-dom";
import {useNavigate} from 'react-router-dom';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
function PasswordReset() {

    // Grab the code and userID from the URL
    let { code, userID } = useParams();

    // Navigation
    const navigate = useNavigate();

    const changePassword = async (e) => {
        e.preventDefault();

        // Make sure the password fields are not empty and match
        let password = document.getElementById('password').value;
        let passwordConfirm = document.getElementById('passwordConfirm').value;

        if (password !== passwordConfirm) {
            // Display an error message if the passwords do not match
            document.querySelector('.error.password').textContent = 'Passwords do not match';
            return;
        }

        // Make sure the password fits the requirements
        if (password.length < 8 || !password.match(/[A-Z]/) || !password.match(/[0-9]/)) {
            // Display an error message if the password does not meet the requirements
            document.querySelector('.error.password').textContent = 'Password must be at least 8 characters long and contain at least one upper case letter and one number';
            return;
        }
        

        try{
            // Send a POST request to the server to change the password
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/User/passwordreset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Code: code,
                    UserID: userID,
                    Password: password
                })
            });

            // Get the response from the server
            const data = await response.json();

            // If the password was changed successfully, redirect the user to the login page (returned OK status code)
            if (response.status === 200) {
                alert('Password changed successfully');
                navigate('/login');
            }
            else {
                alert('Password change failed');
            }

        }
        catch (error) {
            console.log(error);
        }
    };
    
    return (
        <form className='regular-form' onSubmit={changePassword}>
            <h1>Password Reset</h1>
            <p>Please enter your new password below.</p>
            <label htmlFor="password">New Password</label>
            <input type="password" id="password" placeholder="New Password" required />
            <span className='error password'></span>
            <br></br>
            <label htmlFor="passwordConfirm">Confirm New Password</label>
            <input type="password" id="passwordConfirm" placeholder="Confirm New Password" required />
            
            <button>Change Password</button>
        </form>
    )
}

export default PasswordReset;