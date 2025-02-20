import { useState, useEffect } from "react";
import AlertModal from "./alertModal";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const DeleteDrugModal = ({ isOpen, onClose, drugToDelete, setDrugToDelete, onDelete = () => {} }) => {

    const [modalHeight, setModalHeight] = useState('auto');
    const [isSecondModalOpen, setSecondModalOpen] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    const handleDeleteDrug = () => {
        setSecondModalOpen(true);
    }

    const handleConfirmDelete = () => {
        DeleteDrug();
        setSecondModalOpen(false);
        //handleClose();
    }

    const handleCancelDelete = () => {
        setSecondModalOpen(false);
        // And we will close this modal as well
        handleClose();
    }

    const DeleteDrug = async () => {
        try {
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Drug/deletedrug', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify({
                    "DIN": drugToDelete["DIN"]
                })
            });
    
            if (response.ok) {
                //these needs to be in this order for proper deletion and updating list
                setAlertMessage("Drug deleted successfully");
                
                setDrugToDelete({ "DIN": null, selected: false });
                
                onDelete(); //added for refresh?
                // Explicitly call onClose after setting state
                setIsAlertModalOpen(true);
                
                onClose();
            }
            else {
                const data = await response.json();
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
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
        // No-op to just wait for the drugToDelete to be set
    }, [drugToDelete]);


    return (
        <>
        {isOpen && (
            <div className={`modal ${isOpen ? 'isOpen' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className="modal-content" style={{ height: modalHeight,  width:400}}>
                    <span className="close" onClick={handleClose}>&times;</span>
                    <h1>Are you sure you want to delete {drugToDelete["Drug Name"]}?</h1>
                    <button onClick={handleDeleteDrug}>Delete</button>
                    <button onClick={handleClose}>Cancel</button>
                </div>
            </div>
        )}
        {isSecondModalOpen && (
            <div className={`modal ${isSecondModalOpen ? 'isOpen' : ''}`} style={{ display: isSecondModalOpen ? 'flex' : 'none' }}>
            <div className="modal-content" style={{ height: modalHeight,  width:400 }}>
                <span className="close" onClick={handleCancelDelete}>&times;</span>
                <h1>Are you REALLY sure you want to delete this drug? This will delete ALL orders accociated with the drug.</h1>
                <button onClick={handleConfirmDelete}>Yes</button>
                <button onClick={handleCancelDelete}>No</button>
            </div>
        </div>
    )}

    <AlertModal
        isOpen={isAlertModalOpen}
        message={alertMessage}
        onClose={() => setIsAlertModalOpen(false)}
    />
    </>
    );
}

export default DeleteDrugModal;