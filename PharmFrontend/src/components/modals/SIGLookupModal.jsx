import $ from 'jquery';
import { Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import AlertModal from "@components/modals/alertModal";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function SIGLookupModal({visible, setVisible,setSig}){

    //modal alert stuff
    const [AlertModalOpen, setAlertModalOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState();
    const [SIGS, setSIGS] = useState();

    async function getSIGS(){
        let data = await $.ajax({
            url:'https://'+BackendIP+':'+BackendPort+'/api/SIG/getSIGs',
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'Key-Auth':ApiAccess
            }
        })
        console.log(data);
    }

    function onClose(){
        setVisible(false);
    }
    function SelectSIG(){
        getSIGS();
    }
    return(
        <div>
            <AlertModal
                isOpen={AlertModalOpen}
                message={AlertMessage}
                onClose={function(){
                    setAlertModalOpen(false);
                }}
            ></AlertModal>
            <Modal
            show={visible}
            onHide={onClose}
            size="xl"
            className="Modal"
            centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2>Select SIG Code below</h2>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>

                        <div className='d-flex justify-content-center'>
                            <Button type="button" onClick={SelectSIG} className='ModalbuttonG'>Confirm</Button>
                        </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default SIGLookupModal;