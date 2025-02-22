//React imports
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';

//css import
import './signup.css';

//validation import
import { NullCheck, CheckEmail, VarMatch, PassRequirements, CheckNBCCEmail } from '@components/validation/basicValidation.jsx';

//sanitization import
import { SanitizeEmail, SanitizeName } from '@components/datasanitization/sanitization.jsx'; 


function Signup() {

    //states for form inputs
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [campus, setCampus] = useState('Fredericton');

    // Navigation
    const navigate = useNavigate();

    //validation 
    //failures increase error count
    //form is not submitted unless there are no errors
    const validateForm = () => {

        // Spans for error messages
        let fNameErrorSpan = document.querySelector('.fName');
        let lNameErrorSpan = document.querySelector('.lName');
        let emailErrorSpan = document.querySelector('.email');
        let passwordErrorSpan = document.querySelector('.password');
        let passwordConfirmErrorSpan = document.querySelector('.passwordConfirm');
        let campusErrorSpan = document.querySelector('.campus');

        // Error messages
        let emptyField = ' cannot be empty';
        let emailFormat = 'Please enter a valid email';
        let emailNBCC = 'Please enter a valid NBCC email';
        let passwordMatch = 'Passwords do not match';
        let passwordReq = 'Password must be at least 8 characters long and contain at least one capital letter and one number';

        // Error count
        let errors = 0;


        //null checks
        if (!NullCheck(firstName)){
            fNameErrorSpan.textContent = 'First name' + emptyField;
            errors++;
        }
        else{ fNameErrorSpan.textContent = '';}

        if (!NullCheck(lastName)){
            lNameErrorSpan.textContent = 'Last name' + emptyField;
            errors++;
        }
        else{ lNameErrorSpan.textContent = '';}

        if (!NullCheck(password)){
            passwordErrorSpan.textContent = 'Password' + emptyField;
            errors++;
        }
        else{ passwordErrorSpan.textContent = '';}

        if (!NullCheck(confirmPassword)){
            passwordConfirmErrorSpan.textContent = 'Confirm password' + emptyField;
            errors++;
        }
        else{ passwordConfirmErrorSpan.textContent = '';}

        if (!NullCheck(email)){
            emailErrorSpan.textContent = 'Email' + emptyField;
            errors++;
        }
        else{ emailErrorSpan.textContent = '';}

        if (!NullCheck(campus)){
            campusErrorSpan.textContent = 'Campus' + emptyField;
            errors++;
        }
        else{ campusErrorSpan.textContent = '';}

        //email checks
        if (!CheckEmail(email)){
            emailErrorSpan.textContent = emailFormat;
            errors++;
        }
        else{ emailErrorSpan.textContent = '';}

        if (!CheckNBCCEmail(email)){
            emailErrorSpan.textContent = emailNBCC;
            errors++;
        }
        else{ emailErrorSpan.textContent = '';}

        //password checks
        if (!VarMatch(password, confirmPassword)){
            passwordConfirmErrorSpan.textContent = passwordMatch;
            errors++;
        }
        else { passwordConfirmErrorSpan.textContent = ''; }

        if (!PassRequirements(password)){
            passwordErrorSpan.textContent = passwordReq;
            errors++;
        }
        else { passwordErrorSpan.textContent = ''; }

        return errors;
    }

    //remove certain special chars from strings
    const dataSanitize = () => {

        setFirstName(SanitizeName(firstName));
        setLastName(SanitizeName(lastName));
        setEmail(SanitizeEmail(email));

    }

    //submission handler
    const handleSubmit = async (e) => {

        e.preventDefault();

        //form is not submitted unless there are no errors
        let errors = validateForm();

        //check for errors, otherwise submit
        if (errors > 0) return;
        else {
            //sanitization
            dataSanitize();

            // Capitalize first letter of first and last name
            setFirstName(firstName.charAt(0).toUpperCase() + firstName.slice(1));
            setLastName(lastName.charAt(0).toUpperCase() + lastName.slice(1));
            
            //api call for submission
            try {
                const response = await fetch('https://localhost:7172/api/User/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ FirstName: firstName, LastName: lastName, 
                        Password: password, Email: email, Campus: campus }),
                });
                const data = await response.json();
                console.log(data.message);
    
                // Redirect to login page if successful
                if (data.message === 'User added successfully') {
                    alert('User added successfully, check your email for confirmation link');
                    navigate('/login');
                }
                else {
                    alert(data.message + ', please try again');
                }
            }
            catch (error) {
    
                console.log(error);
                return;
    
            }

        }

    };

    return (

        <div id='formDiv'>
            
            <form className='regular-form' onSubmit={handleSubmit}>
                <h1>Sign Up</h1>
                <br></br>
                <div className='form-content'>
                    <div className='left'>
                        <label className='input-label'>First Name:</label>
                        <br></br>
                        <input
                            id='firstName'
                            className="text-input"
                            required
                            type="text"
                            value={firstName}
                            tabIndex={1}
                            onChange={(e) => setFirstName(e.target.value)}>
                        </input>
                        <br></br>
                        <span className='error fName'></span>
                        <br></br>                 

                        <label className='input-label'>Campus:</label>
                        <br></br>
                        <select
                            className="combo-input"
                            required
                            type="text"
                            value={campus}
                            tabIndex={3}
                            onChange={(e) => setCampus(e.target.value)}>
                                <option value="Fredericton">Fredericton</option>
                                <option value="St. John">St. John</option>
                                <option value="Moncton">Moncton</option>
                                <option value="Miramichi">Miramichi</option>
                                <option value="Woodstock">Woodstock</option>
                                <option value="St. Andrews">St. Andrews</option>
                        </select>
                        <br></br>
                        <span className='error campus'></span>

                        <br></br>
                        <label className='input-label'>Password:</label>
                        <br></br>
                        <input
                            className="text-input"
                            required
                            type="password"
                            value={password}
                            tabIndex={5}
                            onChange={(e) => setPassword(e.target.value)}>
                        </input>
                        <br></br>
                        <span className='error password'></span>
                    </div>

                    <div className='right'>
                        <label className='input-label'>Last Name:</label>
                        <br></br>
                        <input
                            className="text-input"
                            required
                            type="text"
                            value={lastName}
                            tabIndex={2}
                            onChange={(e) => setLastName(e.target.value)}>
                        </input>
                        <br></br>
                        <span className='error lName'></span>

                        <br></br>
                        <label className='input-label'>Email:</label>
                        <br></br>
                        <input
                            className="text-input"
                            required
                            type="text"
                            value={email}
                            tabIndex={4}
                            onChange={(e) => setEmail(e.target.value)}>
                        </input>
                        <br></br>
                        <span className='error email'></span>

                        <br></br>
                        <label className='input-label'>Confirm Password:</label>
                        <br></br>
                        <input
                            className="text-input"
                            required
                            type="password"
                            value={confirmPassword}
                            tabIndex={6}
                            onChange={(e) => setConfirmPassword(e.target.value)}>
                        </input>
                        <br></br>
                        <span className='error passwordConfirm'></span>
                    </div>
                </div>
                <br></br>
                <button className="button" type="submit">Submit</button>

            </form>

        </div>

    )

}

export default Signup;