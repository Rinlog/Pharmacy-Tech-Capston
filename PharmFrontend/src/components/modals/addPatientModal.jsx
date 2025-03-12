import { useState, useEffect } from "react";
<<<<<<< HEAD:PharmFrontend/src/components/modals/addPatientModal.jsx
<<<<<<< HEAD
import { SanitizeName, SanitizeDate, SanitizeEmail, SanitizeInput} from "@components/datasanitization/sanitization";
=======
import { SanitizeName, SanitizeDate, SanitizeEmail, SanitizeInput, SanitizeLength} from "@components/datasanitization/sanitization";
>>>>>>> parent of 4118e47 (Initial Main commit):PharmPracticumFrontend/PharmFrontend/src/components/modals/addPatientModal.jsx

=======
import { SanitizeName, SanitizeDate, SanitizeEmail, SanitizeInput, SanitizeLength} from "@components/datasanitization/sanitization";
import AlertModal from "./alertModal";
import { Button, Modal, Form, Dropdown} from "react-bootstrap";
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
>>>>>>> dev
const AddPatientModal = ({ isOpen, onClose}) => {


    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    const AddPatient = async () => {

        // Sanitize the inputs
<<<<<<< HEAD:PharmFrontend/src/components/modals/addPatientModal.jsx
<<<<<<< HEAD
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
=======
        let fName = SanitizeLength(SanitizeInput(document.getElementById('firstName').value));
        let lName = SanitizeLength(SanitizeInput(document.getElementById('lastName').value));
        let dob = SanitizeLength(SanitizeInput(document.getElementById('dob').value));
        let sex = document.getElementById('sex').value;
=======
        let fName = SanitizeLength(SanitizeInput(document.getElementById('firstName').value));
        let lName = SanitizeLength(SanitizeInput(document.getElementById('lastName').value));
        let dob = SanitizeLength(SanitizeInput(document.getElementById('dob').value));
        let sex = SanitizeLength(SanitizeInput(document.getElementById('sex').value));
>>>>>>> parent of 4118e47 (Initial Main commit):PharmPracticumFrontend/PharmFrontend/src/components/modals/addPatientModal.jsx
        let address = SanitizeLength(SanitizeInput(document.getElementById('address').value));
        let city = SanitizeLength(SanitizeInput(document.getElementById('city').value));
        let hospital = SanitizeLength(SanitizeInput(document.getElementById('hospital').value));
        let room = SanitizeLength(SanitizeInput(document.getElementById('room').value));
        let unit = SanitizeLength(SanitizeInput(document.getElementById('unit').value));
        let allergies = SanitizeLength(SanitizeInput(document.getElementById('allergies').value));
        let conditions = SanitizeLength(SanitizeInput(document.getElementById('conditions').value));
<<<<<<< HEAD:PharmFrontend/src/components/modals/addPatientModal.jsx
>>>>>>> dev
=======
>>>>>>> parent of 4118e47 (Initial Main commit):PharmPracticumFrontend/PharmFrontend/src/components/modals/addPatientModal.jsx

        try {
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Patient/addpatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
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
                setAlertMessage("Patient Added");
                setIsAlertModalOpen(true);
                // Close the modal
                //onClose();
            }
            else{// Alert out the message sent from the API
                const data = await response.json();
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            }
            
        }
        catch (error) {
            console.error(error);
            setAlertMessage("An error has occurred. Please contact the administrator.");
            setIsAlertModalOpen(true);
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
        <Modal
            show={isOpen}
            onHide={handleClose}
            size="xl"
            className="Modal"
            centered
        >
        <AlertModal
            isOpen={isAlertModalOpen}
            message={alertMessage}
            onClose={() => {setIsAlertModalOpen(false);
                if (alertMessage === "Patient Added") {
                    onClose();
                }
            }
        }
        />
            <Modal.Header closeButton>
                <h3>Add Patient</h3>
            </Modal.Header>
            <Modal.Body>
                    <form onSubmit={handleSubmit} style={{ width: '90%'}}>
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
                                <select className="form-select" id="sex" tabIndex={4} required>
                                    <option value=""></option>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                    <option value="O">Other</option>
                                </select>
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
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
        )

}

export default AddPatientModal;