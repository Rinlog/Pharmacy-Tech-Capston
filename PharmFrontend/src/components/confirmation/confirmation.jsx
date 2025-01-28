import { useParams } from "react-router-dom";
import {useNavigate} from 'react-router-dom';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
function Confirmation() {

    // Grab the code and userID from the URL
    let { code, userID } = useParams();

    // Navigation
    const navigate = useNavigate();

    const confirmAccount = async (e) => {
        e.preventDefault();

        try{
            // Send a POST request to the server to confirm the account
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/User/confirmation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    Code: code,
                    UserID: userID
                })
            });

            // Get the response from the server
            const data = await response.json();

            // If the account was confirmed successfully, redirect the user to the login page (returned OK status code)
            if (response.status === 200) {

                //were they bulk added? If so, they need to set credentials
                try {

                    const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/User/bulkpassset', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(userID),
                    });
                    const data = await response.json();

                    if (data.data === true) {
                        alert("Account confirmed. You will need to reset your password to login.");
                        window.location.href = '/login';
                    }

                }
                catch{
                    alert("Account confirmed. You will need to reset your password to login.");
                }

                alert('Account confirmed successfully');
                navigate('/login');
            }
            else {
                alert('Account confirmation failed');
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    
    return (
        <form className='regular-form' onSubmit={confirmAccount}>
            <h1>Account Confirmation</h1>
            <p>Thank you for signing up! Please click the button below to confirm your account.</p>
            <button>Confirm Account</button>
        </form>
    )
}

export default Confirmation;