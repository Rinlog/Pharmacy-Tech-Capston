import { useState, useEffect } from "react";
import AlertModal from "./alertModal";
import { Button, Modal, Form, Dropdown} from "react-bootstrap";
import $ from 'jquery'
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const DeletePatientModal = ({ isOpen, onClose, patientsToDelete, setPatientsToDelete}) => {


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
    function getStringOfPPRs(patientsToDelete){
        let tempPPR = ""
        for (let i = 0; i < patientsToDelete.length; i++){
            if (i != (patientsToDelete.length-1)){
                tempPPR = tempPPR.concat(patientsToDelete[i]["Patient ID"] + ",");
            }
            else{
                tempPPR = tempPPR.concat(patientsToDelete[i]["Patient ID"]);
            }
        }
        return tempPPR
    }
    const DeletePatient = async () => {
        try {
            let PatientsPPRsToDelete = getStringOfPPRs(patientsToDelete)
            // Call the API
            const response = await $.ajax('https://'+BackendIP+':'+BackendPort+'/api/Patient/deletepatients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                data: JSON.stringify(PatientsPPRsToDelete)

            });

                setPatientsToDelete([]);
                setAlertMessage(response);
                setIsAlertModalOpen(true);
        }
        catch (error) {
            if (error.responseText){
                setAlertMessage(error.responseText);
                setIsAlertModalOpen(true);
            }
            else{
                setAlertMessage("An error occurred while deleting the patients.");
                setIsAlertModalOpen(true);
            }

        }
    }

    const handleClose = () => {
        onClose();

    }


    return (
        <>
        <AlertModal
            isOpen={isAlertModalOpen}
            message={alertMessage}
            onClose={() => {
                if (alertMessage == "Patients Deleted" || alertMessage == "Patient Deleted"){
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
                <h1>Are you sure you want to delete the selected patients?</h1>
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
                <h1>Are you REALLY sure you want to delete the selected patients? This will delete ALL orders accociated with the patients.</h1>
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