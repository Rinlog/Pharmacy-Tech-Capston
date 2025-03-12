import { useState, useEffect } from "react";
<<<<<<< HEAD
import { SanitizeEmail, SanitizeName, SanitizeDate, SanitizeInput } from "@components/datasanitization/sanitization";


=======
import { SanitizeEmail, SanitizeName, SanitizeDate, SanitizeInput, SanitizeLength} from "@components/datasanitization/sanitization";
import AlertModal from "./alertModal";
import { Button, Modal, Form, Dropdown} from "react-bootstrap";
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
>>>>>>> dev
const AddDrugModal = ({ isOpen, onClose}) => {



    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const AddDrug = async () => {

        // Sanitize the inputs
            // DIN must be an 8 digit number
            if(!/^\d{8}$/.test(document.getElementById('DIN').value)){
                setAlertMessage("DIN must be an 8 digit number");
                setIsAddModalOpen(true);
                return;
            }
            let din = SanitizeInput(document.getElementById('DIN').value);
            let name = SanitizeInput(document.getElementById('drugName').value);
            let dosage = SanitizeInput(document.getElementById('dosage').value);
            let strength = SanitizeInput(document.getElementById('strength').value);
            let manufacturer = SanitizeInput(document.getElementById('manufacturer').value);
            let concentration = SanitizeInput(document.getElementById('concentration').value);
            let referenceBrand = SanitizeInput(document.getElementById('referenceBrand').value);
            let containerSize = SanitizeInput(document.getElementById('containerSize').value);

        try {
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Drug/adddrug', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },

                body: JSON.stringify({
                    "DIN": din,
                    "name": name,
                    "dosage": dosage,
                    "strength": strength,
                    "manufacturer": manufacturer,
                    "concentration": concentration,
                    "referenceBrand": referenceBrand,
                    "containerSize": containerSize
                })
            });
            
            if(response.status === 200) {
                // Alert the user that the drug was added
                setAlertMessage("Drug Added");
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
            setAlertMessage("An error has occurred, please try again later");
            setIsAlertModalOpen(true);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        AddDrug();
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
                            if (alertMessage === "Drug Added") {
                                onClose();
                            }
                        }
                    }
                    />
                        <Modal.Header closeButton>
                            <h3>Add Drug</h3>
                        </Modal.Header>
                        <Modal.Body>
                            <form onSubmit={handleSubmit} style={{ width: '90%'}}>
                            
                                <label htmlFor="DIN">DIN:</label>
                                <input type="text" id="DIN" name="DIN" required/>
                                <br></br>

                                <label htmlFor="drugName">Drug Name:</label>
                                <input type="text" id="drugName" name="drugName" required/>
                                <br></br>

                                <label htmlFor="dosage">Dosage:</label>
                                <input type="text" id="dosage" name="dosage" required/>
                                <br></br>

                                <label htmlFor="strength">Strength:</label>
                                <input type="text" id="strength" name="strength" required/>
                                <br></br>

                                <label htmlFor="manufacturer">Manufacturer:</label>
                                <input type="text" id="manufacturer" name="manufacturer" required/>
                                <br></br>

                                <label htmlFor="concentration">Concentration:</label>
                                <input type="text" id="concentration" name="concentration" required/>
                                <br></br>

                                <label htmlFor="referenceBrand">Reference Brand:</label>
                                <input type="text" id="referenceBrand" name="referenceBrand"/>
                                <br></br>

                                <label htmlFor="containerSize">Container Size:</label>
                                <input type="text" id="containerSize" name="containerSize" required/>
                                <br></br>

                                <br></br>

                                <button type="submit">Add Drug</button>
                            </form>
                        </Modal.Body>
                        <Modal.Footer>

                        </Modal.Footer>
                    </Modal>
            

        )
}

export default AddDrugModal;