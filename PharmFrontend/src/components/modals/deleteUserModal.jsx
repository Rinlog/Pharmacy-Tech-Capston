import { useState } from "react";
import he from 'he';
import AlertModal from "./alertModal";
import { Button, Modal, Form, Dropdown} from "react-bootstrap";
const BackendIP = import.meta.env.VITE_BackendIP;
const BackendPort = import.meta.env.VITE_BackendPort;
const ApiAccess = import.meta.env.VITE_APIAccess;

const DeleteUserModal = ({ isOpen, onClose, userToDelete }) => {
    const [modalHeight, setModalHeight] = useState('auto');
    const [isSecondModalOpen, setSecondModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleDeleteUser = () => {
        setSecondModalOpen(true);
    };

    const handleCancelDelete = () => {
        setSecondModalOpen(false);
        onClose();
    };

    const handleConfirmDelete = () => {
        setSecondModalOpen(false);
        deleteUser();
    };

    const deleteUser = async () => {
        try {
            //Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Management/deleteuser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth': ApiAccess
                },
                body: JSON.stringify(userToDelete["User ID"])
            });
    
            if (response.ok) {
                setAlertMessage("User Successfully Deleted");
                setIsAlertModalOpen(true);
                //onDelete(); //added for refresh
                //onClose();
            } 
            else {
                // Alert out the message sent from the API
                const data = await response.json();
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            }
        } catch (error) {
            console.log(error);
            setAlertMessage("An error occurred while deleting the user.");
            setIsAlertModalOpen(true);
        }
    };

    return (
        <>
            <AlertModal
                isOpen={isAlertModalOpen}
                message={alertMessage}
                onClose={() => {setIsAlertModalOpen(false);
                        if (alertMessage === "User Successfully Deleted") {
                            onClose();
                        }
            }}
            />
            <Modal
                show={isOpen}
                onHide={onClose}
                size="lg"
                className="Modal"
                centered
            >
                <Modal.Header closeButton>
                    <h3>Delete User</h3>
                </Modal.Header>
                <Modal.Body>
                <h1>Are you sure you want to delete {userToDelete["First Name"]}?</h1>
                <Button className="ModalbuttonG w-100" onClick={handleDeleteUser}>Delete</Button>
                <Button className="ModalbuttonB w-100" onClick={onClose}>Cancel</Button>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

            <Modal
                show={isSecondModalOpen}
                onHide={function(){
                    setSecondModalOpen(false)
                    onClose();
                }}
                size="lg"
                className="Modal"
                centered
            >
                <Modal.Header closeButton>
                    <h3>Delete User</h3>
                </Modal.Header>
                <Modal.Body>
                <h1>Are you REALLY sure you want to delete this user? This will delete ALL orders accociated with the user.</h1>
                <Button className="ModalbuttonG w-100" onClick={handleConfirmDelete}>Yes</Button>
                <Button className="ModalbuttonB w-100" onClick={handleCancelDelete}>No</Button>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>

        </>
    );
};

export default DeleteUserModal;