import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import LoadingModal from '../modals/loadingModal';
import AlertModal from "./alertModal";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const ResetPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    const [isLoadingOpen, setIsLoadingOpen] = useState(false);
    const handleForgotPassword = async () => {
        if (!email) {
            setEmailError("Email is required");
            return;
        }
    
        try {
            setIsLoadingOpen(true)
            onClose()
            const response = await fetch('https://' + BackendIP + ':' + BackendPort + '/api/User/resetrequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth': ApiAccess
                },
                body: JSON.stringify({ Email: email }),
            });

            const data = await response.json();
            setIsLoadingOpen(false)
            if (!response.ok) {
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            } else {
                setAlertMessage("Password reset instructions have been sent to your email.");
                setIsAlertModalOpen(true);
                setEmail("");
                setEmailError("");
                //onClose();
            }
        } catch (error) {
            setAlertMessage("Could not process your request a this time. Please contact the system administrator.");
            setIsAlertModalOpen(true);
        }
    };

    return (
        <div>
            <AlertModal
                isOpen={isAlertModalOpen}
                message={alertMessage}
                onClose={() => {
                    setIsAlertModalOpen(false);
                    if (alertMessage === "Password reset instructions have been sent to your email.") {
                        onClose();
                    }
                }}
            />
            <LoadingModal
                isOpen={isLoadingOpen}
                setIsOpen={setIsLoadingOpen}
            ></LoadingModal>
            <Modal 
            show={isOpen} 
            onHide={onClose} 
            size="md" 
            centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2>Reset Password</h2>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h3>Enter your email to receive reset instructions:</h3>
                    <Form>
                        <Form.Group className="d-flex flex-column">
                            <Form.Control
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {emailError && <div style={{ color: 'red', fontSize: '12px' }}>{emailError}</div>}
                        </Form.Group>

                        <div className="d-flex justify-content-center">
                            <Button type="button" onClick={handleForgotPassword} className='ModalbuttonG'>Send Reset Link</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ResetPasswordModal;
