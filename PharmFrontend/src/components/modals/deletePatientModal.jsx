import { useState, useEffect } from "react";
import AlertModal from "./alertModal";
import { Button, Modal, Form, Dropdown} from "react-bootstrap";
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const DeletePatientModal = ({ isOpen, onClose, patientToDelete, setPatientToDelete, onDelete = () => {} }) => {


    const [isSecondModalOpen, setSecondModalOpen] = useState(false);

    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleDeletePatient = () => {
        setSecondModalOpen(true);
    }

    const handleConfirmDelete = () => {
        setSecondModalOpen(false);
        DeletePatient();
    }

    const handleCancelDelete = () => {
        setSecondModalOpen(false);
        handleClose();
    }

    const DeletePatient = async () => {
        try {
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Patient/deletepatient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify({
                    "PPR": patientToDelete["Patient ID"]
                })

            });

            if (response.ok) {
                setAlertMessage("Patient deleted successfully");

                setPatientToDelete({ "Patient ID": null, selected: false });
                
                setIsAlertModalOpen(true);
            }
            else{
                // Alert out the message sent from the API
                const data = await response.json();
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            }
        }
        catch (error) {
            console.log(error);
            setAlertMessage("An error occurred while deleting the patient.");
            setIsAlertModalOpen(true);
        }
    }

    const handleClose = () => {
        onClose();
    }

    useEffect(() => {
        // No-op
    }, [patientToDelete]);


    return (
        <>
        <AlertModal
            isOpen={isAlertModalOpen}
            message={alertMessage}
            onClose={() => {
                if (alertMessage == "Patient deleted successfully"){
                    handleClose(); //refreshs Patient list
                }
                setIsAlertModalOpen(false)
            }}
        />
            <Modal
                show={isOpen}
                onHide={handleClose}
                size="lg"
                className="Modal"
                centered
            >
                <Modal.Header closeButton>
                    <h3>Delete Patient</h3>
                </Modal.Header>
                <Modal.Body>
                <h1>Are you sure you want to delete {patientToDelete["First Name"]}?</h1>
                <Button className="ModalbuttonG w-100" onClick={handleDeletePatient}>Delete</Button>
                <Button className="ModalbuttonB w-100" onClick={handleClose}>Cancel</Button>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            <Modal
                show={isSecondModalOpen}
                onHide={function(){
                    setSecondModalOpen(false)
                    handleClose();
                }}
                size="lg"
                className="Modal"
                centered
            >
                <Modal.Header closeButton>
                    <h3>Delete Patient</h3>
                </Modal.Header>
                <Modal.Body>
                <h1>Are you REALLY sure you want to delete this patient? This will delete ALL orders accociated with the patient.</h1>
                <Button className="ModalbuttonG w-100" onClick={handleConfirmDelete}>Yes</Button>
                <Button className="ModalbuttonB w-100" onClick={handleCancelDelete}>No</Button>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeletePatientModal;