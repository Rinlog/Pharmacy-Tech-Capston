import { useState } from "react";
import he from 'he';
import AlertModal from "./alertModal";

const BackendIP = import.meta.env.VITE_BackendIP;
const BackendPort = import.meta.env.VITE_BackendPort;
const ApiAccess = import.meta.env.VITE_APIAccess;

const DeleteUserModal = ({ isOpen, onClose, userToDelete, onDelete = () => {} }) => {
    const [modalHeight, setModalHeight] = useState('auto');
    const [isSecondModalOpen, setSecondModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const handleDeleteUser = () => {
        setSecondModalOpen(true);
    };

    const handleCancelDelete = () => {
        setSecondModalOpen(false);
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
        {isOpen && !isSecondModalOpen && (
            <div className="modal isOpen" style={{ display: 'flex' }}>
                <div className="modal-content" style={{ height: modalHeight, width: 400 }}>
                    <span className="close" onClick={onClose}>&times;</span>
                    <h1>Are you sure you want to delete {he.decode(userToDelete["First Name"])} {he.decode(userToDelete["Last Name"])}?</h1>
                    <button onClick={handleDeleteUser}>Delete</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        )}

        {isSecondModalOpen && (
            <div className="modal isOpen" style={{ display: 'flex' }}>
                <div className="modal-content" style={{ height: modalHeight, width: 400 }}>
                    <span className="close" onClick={handleCancelDelete}>&times;</span>
                    <h1>Are you REALLY sure you want to delete this user?</h1>
                    <button onClick={handleConfirmDelete}>Yes</button>
                    <button onClick={handleCancelDelete}>No</button>
                </div>
            </div>
        )}

        <AlertModal
            isOpen={isAlertModalOpen}
            message={alertMessage}
            onClose={() => {setIsAlertModalOpen(false);
                    if (alertMessage === "User Successfully Deleted") {
                        onDelete();
                        onClose();
                    }
    }}
    />
    </>
    );
};

export default DeleteUserModal;