import { useState, useEffect } from "react";
import { SanitizeName, SanitizeDate, SanitizeEmail, SanitizeInput} from "@components/datasanitization/sanitization";

const AddPatientModal = ({ isOpen, onClose}) => {

    const [modalHeight, setModalHeight] = useState('auto');

    const AddPatient = async () => {

        // Sanitize the inputs
        let fName = SanitizeInput(document.getElementById('firstName').value);
        let lName = SanitizeInput(document.getElementById('lastName').value);
        let dob = SanitizeInput(document.getElementById('dob').value);
        let sex = SanitizeInput(document.getElementById('sex').value);
        let address = SanitizeInput(document.getElementById('address').value);
        let city = SanitizeInput(document.getElementById('city').value);
        let hospital = SanitizeInput(document.getElementById('hospital').value);
        let room = SanitizeInput(document.getElementById('room').value);
        let unit = SanitizeInput(document.getElementById('unit').value);
        let allergies = SanitizeInput(document.getElementById('allergies').value);
        let conditions = SanitizeInput(document.getElementById('conditions').value);

        try {
            // Call the API
            const response = await fetch('https://localhost:7172/api/Patient/addpatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    // PPR is 0 as a placeholder, we don't need it for adding a patient but the API requires it to not be null
                    "PPR": "0",
                    "fName": fName,
                    "lName": lName,
                    "dob": dob,
                    "sex": sex,
                    "address": address,
                    "city": city,
                    "hospitalName": hospital,
                    "roomNumber": room,
                    "unitNumber": unit,
                    "allergies": allergies,
                    "conditions": conditions
                })
            });
            
            if(response.status === 200) {
                // Alert the user that the patient was added
                alert("Patient Added");
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
        AddPatient();
    }

    const handleClose = () => {
        onClose();
    }

    return (
        isOpen && (
            <div className={`modal ${isOpen ? 'isOpen' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className="modal-content" style={{ height: modalHeight, width: '60%' }}>
                    <span className="close" onClick={handleClose}>&times;</span>

                    <form onSubmit={handleSubmit} style={{ width: '90%'}}>
                        <h1>Add Patient</h1>
                        <div className='form-content'>
                            <div className='left'>
                                <label>First Name</label> <br></br>
                                <input type="text" id="firstName" tabIndex={1} required /> <br></br>

                                <label>Date of Birth</label> <br></br>
                                <input type="date" id="dob" tabIndex={3} required /> <br></br>

                                <label>Address</label> <br></br>
                                <input type="text" id="address" tabIndex={5} required /> <br></br>

                                <label>Hospital</label> <br></br>
                                <input type="text" id="hospital" tabIndex={7} required /> <br></br>

                                {/* Empty pixel to match the other side */}
                                <div style={{padding: 1 + "px"}}></div>
                                <label>Room #</label> <br></br>
                                <input type="text" id="room" tabIndex={8} required /> <br></br>

                                <label>Allergies (Comma Separated)</label> <br></br>
                                <textarea id="allergies" rows="3" tabIndex={10} required /> <br></br>

                            </div>

                            <div className='right'>
                                <label>Last Name</label> <br></br>
                                <input type="text" id="lastName" tabIndex={2} required /> <br></br>
                                <label>Sex</label> <br></br>
                                <input type="text" id="sex" tabIndex={4} required /> <br></br>
                                <label>City</label> <br></br>
                                <input type="text" id="city" tabIndex={6} required /> <br></br>
                                {/* Empty line to match up with the left side*/}
                                <div style={{padding: 16 + "px"}}></div>
                                
                                <br></br>
                                <label>Unit #</label> <br></br>
                                <input type="text" id="unit" tabIndex={9} required /> <br></br>
                                <label>Conditions (Comma Separated)</label> <br></br>
                                <textarea id="conditions" rows="3" tabIndex={11} required /> <br></br>
                            </div>
                            <br></br>
                        </div>

                        <button type="submit" tabIndex={12}>Add Patient</button>
                    </form>
                </div>
            </div>
        )
    );
}

export default AddPatientModal;