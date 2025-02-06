import { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const ResetPasswordModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const handleForgotPassword = async () => {
        if (!email) {
            setEmailError("Email is required");
            return;
        }
    
        try {
            const response = await fetch('https://' + BackendIP + ':' + BackendPort + '/api/User/resetrequest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth': ApiAccess
                },
                body: JSON.stringify({ Email: email }),
            });

            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
            } else {
                alert("Password reset instructions have been sent to your email.");
                setEmail("");
                setEmailError("");
                onClose();
            }
        } catch (error) {
            alert("Could not process your request at this time. Please contact the system administrator.");
        }
    };

    return (
        <Modal 
        show={isOpen} 
        onHide={onClose} 
        size="md" 
        centered backdrop="static"
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
                        <Button type="button" onClick={handleForgotPassword} className='Modalbutton'>Send Reset Link</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ResetPasswordModal;
