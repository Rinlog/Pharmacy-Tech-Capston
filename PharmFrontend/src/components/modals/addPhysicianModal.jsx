import { useState, useEffect } from "react";
import { SanitizeName } from "@components/datasanitization/sanitization";

import { SanitizeInput, SanitizeLength } from "@components/datasanitization/sanitization";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const AddPhysicianModal = ({ isOpen, onClose}) => {

    const [modalHeight, setModalHeight] = useState('auto');

    const AddPhysician = async () => {

        // Sanitize the inputs
        let fName = SanitizeLength(SanitizeInput(document.getElementById('firstName').value));
        let lName = SanitizeLength(SanitizeInput(document.getElementById('lastName').value));
        let city = SanitizeLength(SanitizeInput(document.getElementById('city').value));
        let province = SanitizeInput(document.getElementById('province').value);

        try {
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Physician/addphysician', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },

                body: JSON.stringify({
                    // PhysicianID is 0 as a placeholder, we don't need it for adding a physician but the API requires it to not be null
                    "PhysicianID": "0",
                    "fName": fName,
                    "lName": lName,
                    "city": city,
                    "province": province
                })
            });
            
            if(response.status === 200) {
                // Alert the user that the physician was added
                alert("Physician Added");
                // Close the modal
                onClose();
            }
            else{// Alert out the message sent from the API
                const data = await response.json();
                alert(data.message);
            }
            
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        AddPhysician();
    }

    const handleClose = () => {
        onClose();
    }

    return (
        isOpen && (
            <div className={`modal ${isOpen ? 'isOpen' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className="modal-content" style={{ height: modalHeight, width: '30%' }}>
                    <span className="close" onClick={handleClose}>&times;</span>

                    <form onSubmit={handleSubmit} style={{ width: '90%'}}>
                        <h1>Add Physician</h1>

                        <label>First Name:</label>
                        <input id="firstName" type="text" required></input><br></br>

                        <label>Last Name:</label>
                        <input id="lastName" type="text" required></input><br></br>

                        <label>City:</label>
                        <input id="city" type="text" required></input><br></br>

                        <label>Province:</label>
                        <select id="province" required defaultValue="" style={{width:'50%'}}>
                            <option value="" disabled>Select Province</option>
                            <option value="AB">Alberta</option>
                            <option value="BC">British Columbia</option>
                            <option value="MB">Manitoba</option>
                            <option value="NB">New Brunswick</option>
                            <option value="NL">Newfoundland and Labrador</option>
                            <option value="NS">Nova Scotia</option>
                            <option value="ON">Ontario</option>
                            <option value="PE">Prince Edward Island</option>
                            <option value="QC">Quebec</option>
                            <option value="SK">Saskatchewan</option>
                            <option value="NT">Northwest Territories</option>
                            <option value="NU">Nunavut</option>
                            <option value="YT">Yukon</option>
                        </select>
                        <br></br>

                        <button type="submit">Add Physician</button>
                    </form>
                </div>
            </div>
        )
    );
}

export default AddPhysicianModal;