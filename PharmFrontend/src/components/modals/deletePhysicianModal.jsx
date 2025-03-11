import { useState, useEffect } from "react";

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';
import AlertModal from "./alertModal";
import { Button, Modal, Form, Dropdown} from "react-bootstrap";
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const DeletePhysicianModal = ({ isOpen, onClose, physicianToDelete, setPhysicianToDelete }) => {

    const [modalHeight, setModalHeight] = useState('auto');
    const [isSecondModalOpen, setSecondModalOpen] = useState(false);

    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleDeletePhysician = () => {
        setSecondModalOpen(true);
    }

    const handleConfirmDelete = () => {
        setSecondModalOpen(false);
        DeletePhysician();
    }

    const handleCancelDelete = () => {
        setSecondModalOpen(false);
        handleClose();
    }

    const DeletePhysician = async () => {
        try {

            const physiciansToDelete = physicianToDelete.map(physician => physician.physicianID);

            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Physician/deletephysician', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(physiciansToDelete)

            });

            if (response.ok) {
                setAlertMessage("Physician deleted successfully");
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
            setAlertMessage("An error occurred while deleting the user.");
            setIsAlertModalOpen(true);
        }
    }

    const handleClose = () => {
        setPhysicianToDelete([]);
        onClose();
    }


    return (
        <>
            <AlertModal
                isOpen={isAlertModalOpen}
                message={alertMessage}
                onClose={() => {setIsAlertModalOpen(false)
                        if (alertMessage === "Physician deleted successfully") {
                            handleClose(); //this refreshes the table
                        }
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
                    <h3>Delete Physician</h3>
                </Modal.Header>
                <Modal.Body>
                <h1>Are you sure you want to delete the following physicians?</h1>
                <ul>{/*need to make sure to show all the physicians selected .map is used to ease*/}
                    {physicianToDelete.map((physician, index) => (
                        <li key= {index}>{physician.name}</li>
                    ))}
                </ul>
                <Button className="ModalbuttonG w-100" onClick={handleDeletePhysician}>Delete</Button>
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
                    <h3>Delete Physician</h3>
                </Modal.Header>
                <Modal.Body>
                <h1>Are you REALLY sure you want to delete this physician? This will delete ALL orders accociated with the physician.</h1>
                <Button className="ModalbuttonG w-100" onClick={handleConfirmDelete}>Yes</Button>
                <Button className="ModalbuttonB w-100" onClick={handleCancelDelete}>No</Button>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </>
    );
}

export default DeletePhysicianModal;