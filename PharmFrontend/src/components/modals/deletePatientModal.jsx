import { useState, useEffect } from "react";
import AlertModal from "./alertModal";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const DeletePatientModal = ({ isOpen, onClose, patientToDelete, setPatientToDelete, onDelete = () => {} }) => {

    const [modalHeight, setModalHeight] = useState('auto');
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
        {isOpen && (
            <div className={`modal ${isOpen ? 'isOpen' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
                <div className="modal-content" style={{ height: modalHeight,  width:400 }}>
                    <span className="close" onClick={handleClose}>&times;</span>
                    <h1>Are you sure you want to delete {patientToDelete["First Name"]} {patientToDelete["Last Name"]}?</h1>
                    <button onClick={handleDeletePatient}>Delete</button>
                    <button onClick={handleClose}>Cancel</button>
                </div>
            </div>
        )}
        {isSecondModalOpen && (
            <div className={`modal ${isSecondModalOpen ? 'isOpen' : ''}`} style={{ display: isSecondModalOpen ? 'flex' : 'none' }}>
            <div className="modal-content" style={{ height: modalHeight,  width:400 }}>
                <span className="close" onClick={handleCancelDelete}>&times;</span>
                <h1>Are you REALLY sure you want to delete this patient? This will delete ALL orders accociated with the patient.</h1>
                <button onClick={handleConfirmDelete}>Yes</button>
                <button onClick={handleCancelDelete}>No</button>
            </div>
        </div>
    )}

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
    </>
    );
}

export default DeletePatientModal;