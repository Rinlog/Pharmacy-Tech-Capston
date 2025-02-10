import { Modal, Button } from "react-bootstrap";

const SubmitEditDrugModal = ({ isOpen, message, onClose }) => {
    return (
        <Modal 
            show={isOpen} 
            onHide={onClose} 
            size="md" 
            centered 
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <h4>Drug Edit Status</h4>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>

            <div className="d-flex justify-content-center">
            <Button type="button" className="ModalbuttonG" onClick={onClose}>
                Close
            </Button>
            </div>
        </Modal>
    );
};

export default SubmitEditDrugModal;
