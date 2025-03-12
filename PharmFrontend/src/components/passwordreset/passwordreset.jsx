import { useParams } from "react-router-dom";
import {useNavigate} from 'react-router-dom';
import AlertModal from "../modals/alertModal";
import { useState } from "react";
import { PassRequirements} from '@components/validation/basicValidation.jsx';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function PasswordReset() {

    // Grab the code and userID from the URL
    let { code, userID } = useParams();

    //Modal things
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

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
        if (password.length < 8 || !PassRequirements(password)) {
            // Display an error message if the password does not meet the requirements
            document.querySelector('.error.password').textContent = 'Password must contain at least 8 characters, one capital letter, one lower case, one number and a special character';
            return;
        }
        

        try{
            // Send a POST request to the server to change the password
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/User/passwordreset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify({
                    Code: code,
                    UserID: userID,
                    Password: password
                })
            });

            // Get the response from the server
            const data = await response.json();
            console.log(data);

            // If the password was changed successfully, redirect the user to the login page (returned OK status code)
            if (response.status === 200) {
                setAlertMessage("Password changed successfully");
                setIsAlertModalOpen(true);
                //navigate('/login');
            }
            else {
                setAlertMessage("Password change failed");
                setIsAlertModalOpen(true);
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

            <AlertModal
                isOpen={isAlertModalOpen}
                message={alertMessage}
                onClose={() => {{setIsAlertModalOpen(false)
                    if (alertMessage === "Password changed successfully") {
                        navigate("/login");
                    }
                }}}
            />
        </form>
    )
}

export default PasswordReset;