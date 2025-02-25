import { useState, useEffect } from "react";

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';
import AlertModal from "./alertModal";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const DeletePhysicianModal = ({ isOpen, onClose, physicianToDelete, onDelete = () => {} }) => {

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
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Physician/deletephysician', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify({
                    "PhysicianID": physicianToDelete["Physician ID"]
                })

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
        onClose();
    }

    useEffect(() => {
        // No-op
    }, [physicianToDelete]);


    return (
        <>
        {isOpen && (
            <div className={`modal ${isOpen ? 'isOpen' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className="modal-content" style={{ height: modalHeight,  width:400 }}>
                    <span className="close" onClick={handleClose}>&times;</span>
                    <h1>Are you sure you want to delete {he.decode(physicianToDelete["First Name"])} {he.decode(physicianToDelete["Last Name"])}?</h1>
                    <button onClick={handleDeletePhysician}>Delete</button>
                    <button onClick={handleClose}>Cancel</button>
                </div>
            </div>
        )}
        {isSecondModalOpen && (
            <div className={`modal ${isSecondModalOpen ? 'isOpen' : ''}`} style={{ display: isSecondModalOpen ? 'flex' : 'none' }}>
            <div className="modal-content" style={{ height: modalHeight,  width:400 }}>
                <span className="close" onClick={handleCancelDelete}>&times;</span>
                <h1>Are you REALLY sure you want to delete this physician? This will delete ALL orders accociated with the physician.</h1>
                <button onClick={handleConfirmDelete}>Yes</button>
                <button onClick={handleCancelDelete}>No</button>
            </div>
        </div>
    )}

    <AlertModal
        isOpen={isAlertModalOpen}
        message={alertMessage}
        onClose={() => {setIsAlertModalOpen(false)
                if (alertMessage === "Physician deleted successfully") {
                    handleClose(); //this refreshes the table
                }
    }}
    />
    </>
    );
}

export default DeletePhysicianModal;