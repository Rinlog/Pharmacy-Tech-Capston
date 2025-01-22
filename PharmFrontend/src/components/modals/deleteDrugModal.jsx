import { useState, useEffect } from "react";

const DeleteDrugModal = ({ isOpen, onClose, drugToDelete, setDrugToDelete}) => {

    const [modalHeight, setModalHeight] = useState('auto');
    const [isSecondModalOpen, setSecondModalOpen] = useState(false);

    const handleDeleteDrug = () => {
        setSecondModalOpen(true);
    }

    const handleConfirmDelete = () => {
        DeleteDrug();
        setSecondModalOpen(false);
        handleClose();
    }

    const handleCancelDelete = () => {
        setSecondModalOpen(false);
        // And we will close this modal as well
        handleClose();
    }

    const DeleteDrug = async () => {
        try {
            // Call the API
            const response = await fetch('https://localhost:7172/api/Drug/deletedrug', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "DIN": drugToDelete["DIN"]
                })

            });

            if (response.ok) {
                alert("Drug deleted successfully");
                // Clear the drugToDelete
                setDrugToDelete({ "DIN": null, selected: false });
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
        // No-op to just wait for the drugToDelete to be set
    }, [drugToDelete]);


    return (
        <>
        {isOpen && (
            <div className={`modal ${isOpen ? 'isOpen' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className="modal-content" style={{ height: modalHeight }}>
                    <span className="close" onClick={handleClose}>&times;</span>
                    <h1>Are you sure you want to delete {drugToDelete["Drug Name"]}?</h1>
                    <button onClick={handleDeleteDrug}>Delete</button>
                    <button onClick={handleClose}>Cancel</button>
                </div>
            </div>
        )}
        {isSecondModalOpen && (
            <div className={`modal ${isSecondModalOpen ? 'isOpen' : ''}`} style={{ display: isSecondModalOpen ? 'flex' : 'none' }}>
            <div className="modal-content" style={{ height: modalHeight }}>
                <span className="close" onClick={handleCancelDelete}>&times;</span>
                <h1>Are you REALLY sure you want to delete this drug? This will delete ALL orders accociated with the drug.</h1>
                <button onClick={handleConfirmDelete}>Yes</button>
                <button onClick={handleCancelDelete}>No</button>
            </div>
        </div>
    )}
    </>
    );
}

export default DeleteDrugModal;