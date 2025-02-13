import { Modal, Button } from "react-bootstrap";

const AlertModal = ({ isOpen, message, onClose }) => {
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
                    <h3>Important!</h3>
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <h5>{message}</h5>
            </Modal.Body>

            <div className="d-flex justify-content-center">
            <Button type="button" className="ModalbuttonG" onClick={onClose}>
                Close
            </Button>
            </div>
        </Modal>
    );
};

export default AlertModal;
