import { useState, useEffect } from "react";
import { SanitizeName } from "@components/datasanitization/sanitization";

<<<<<<< HEAD:PharmFrontend/src/components/modals/addPhysicianModal.jsx
<<<<<<< HEAD
import { SanitizeInput } from "@components/datasanitization/sanitization";
=======
import { SanitizeInput, SanitizeLength } from "@components/datasanitization/sanitization";
>>>>>>> parent of 4118e47 (Initial Main commit):PharmPracticumFrontend/PharmFrontend/src/components/modals/addPhysicianModal.jsx


=======
import { SanitizeInput, SanitizeLength } from "@components/datasanitization/sanitization";
import AlertModal from "./alertModal";
import { Button, Modal, Form, Dropdown} from "react-bootstrap";
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
>>>>>>> dev
const AddPhysicianModal = ({ isOpen, onClose}) => {

    const [modalHeight, setModalHeight] = useState('auto');

    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

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
                setAlertMessage("Physician Added");
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
            <Modal
                show={isOpen}
                onHide={handleClose}
                size="lg"
                className="Modal"
                centered
            >
            <AlertModal
                isOpen={isAlertModalOpen}
                message={alertMessage}
                onClose={() => {setIsAlertModalOpen(false);
                    if (alertMessage === "Physician Added") {
                        onClose();
                    }
                }
            }
            />
                <Modal.Header closeButton>
                    <h3>Add Physician</h3>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit} style={{ width: '90%'}}>

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
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

        )
}

export default AddPhysicianModal;