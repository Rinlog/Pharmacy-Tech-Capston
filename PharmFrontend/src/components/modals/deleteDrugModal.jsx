import { useState, useEffect } from "react";
import AlertModal from "./alertModal";
import { Button, Modal, Form, Dropdown} from "react-bootstrap";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const DeleteDrugModal = ({ isOpen, onClose, drugToDelete, setDrugToDelete}) => {

    const [modalHeight, setModalHeight] = useState('auto');
    const [isSecondModalOpen, setSecondModalOpen] = useState(false);

    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    const handleDeleteDrug = () => {
        setSecondModalOpen(true);
    }

    const handleConfirmDelete = () => {
        setSecondModalOpen(false);
        DeleteDrugs();
    }

    const handleCancelDelete = () => {
        setSecondModalOpen(false);
        // And we will close this modal as well
        handleClose();
    }

    const DeleteDrugs = async () => {
        try {

            const drugsToDelete = drugToDelete.map(drug => drug.din);

            //console.log("Drugs to delete SENDING", drugsToDelete); //dubugging

            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Drug/deletedrug', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(drugsToDelete) //send the array of drugs to delete
            });

    
            if (response.ok) {
                //these needs to be in this order for proper deletion and updating list
                setAlertMessage("Drugs Deleted Successfully");
                
                setDrugToDelete([]);
                

                // Explicitly call onClose after setting state
                setIsAlertModalOpen(true);
                
            }
            else {
                const data = await response.json();
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            }
        }
        catch (error) {
            console.log(error);
            setAlertMessage("Error deleting drugs");
            setIsAlertModalOpen(true);
        }
    }

    const handleClose = () => {
        setDrugToDelete([]);
        onClose();
    }

    useEffect(() => {
        // No-op to just wait for the drugToDelete to be set
    }, [drugToDelete]);


    return (
        <>
            <AlertModal
                isOpen={isAlertModalOpen}
                message={alertMessage}
                onClose={() => {
                    if (alertMessage == "Drugs Deleted Successfully"){
                        handleClose();//This will refresh the drug list
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
                    <h3>Delete Drug</h3>
                </Modal.Header>
                <Modal.Body>
                <h1>Are you sure you want to delete the following drugs?</h1>
                <ul>{/*need to make sure to show all the drugs selected .map is used to ease*/}
                    {drugToDelete.map((drug, index) => (
                        <li key= {index}>{drug.name}</li>
                    ))}
                </ul>
                <Button className="ModalbuttonG w-100" onClick={handleDeleteDrug}>Delete</Button>
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
                    <h3>Delete Drug</h3>
                </Modal.Header>
                <Modal.Body>
                <h1>Are you REALLY sure you want to delete this drug? This will delete ALL orders accociated with the drug.</h1>
                <Button className="ModalbuttonG w-100" onClick={handleConfirmDelete}>Yes</Button>
                <Button className="ModalbuttonB w-100" onClick={handleCancelDelete}>No</Button>
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
    
    </>
    );
}

export default DeleteDrugModal;