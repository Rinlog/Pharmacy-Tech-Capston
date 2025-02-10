import { useState, useEffect } from "react";

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const DeletePhysicianModal = ({ isOpen, onClose, physicianToDelete, onDelete = () => {} }) => {

    const [modalHeight, setModalHeight] = useState('auto');
    const [isSecondModalOpen, setSecondModalOpen] = useState(false);

    const handleDeletePhysician = () => {
        setSecondModalOpen(true);
    }

    const handleConfirmDelete = () => {
        DeletePhysician();
        setSecondModalOpen(false);
        handleClose();
    }

    const handleCancelDelete = () => {
        setSecondModalOpen(false);
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
                alert("Physician deleted successfully");
                onDelete(); //added for refresh
                onClose();
            }
            else{
                // Alert out the message sent from the API
                const data = await response.json();
                alert(data.message);
            }
        }
        catch (error) {
            console.log(error);
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
                <h1>Are you REALLY sure you want to delete this physician?</h1>
                <button onClick={handleConfirmDelete}>Yes</button>
                <button onClick={handleCancelDelete}>No</button>
            </div>
        </div>
    )}
    </>
    );
}

export default DeletePhysicianModal;