
import { useEffect } from 'react';
import {useState} from 'react'
import { useCookies } from "react-cookie";
import { CheckAuth } from "@components/login/CheckAuth";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as React from 'react'
import $ from 'jquery';
import AlertModal from "@components/modals/alertModal";

import { useContext } from 'react';
import AuthContext from './AuthContext';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function ManageLoginStatus(){

    const authState = CheckAuth();
    const {logout} = useContext(AuthContext);
    let idleRef = React.useRef(0).current;
    const [reloadIdleTime, setReloadIdleTimer] = useState(0);

    const [visible, setVisible] = useState(false); //used to show or hide modal

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const [cookies, setCookie, removeCookie] = useCookies(['user', 'admin']);

    //modal alert stuff
    const [AlertModalOpen, setAlertModalOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState();
    useEffect(function(){
        if (authState.loggedIn === true){
            const idleInterval = setInterval(timerIncrement, 1000);
            function timerIncrement() {
                idleRef += 1;
                //console.log(idleRef) //debug code that shows how many seconds have passed
                if (idleRef > 119) { // 2 minute
                    // Do something here
                    clearInterval(idleInterval);

                    setVisible(true);
                }
            }

            function resetIdleRef() {
                idleRef = 0;
            }
            document.body.addEventListener('mousemove', resetIdleRef);
            document.body.addEventListener('keypress', resetIdleRef);

            //clears previous useeffect hook before starting the new one
            return () => {
                document.body.removeEventListener('mousemove', resetIdleRef);
                document.body.removeEventListener('keypress', resetIdleRef);
                clearInterval(idleInterval);
            };
        }
    },[authState.loggedIn,reloadIdleTime])

    window.onbeforeunload = function(e){
        //if we are prompted to relogin and we decide to refresh, log the user out.
        if (visible == true){
            logout();
        }
    }
    //LoginModalStuff
    async function HandleReLogin(e){

        const Email = $("#Email").val();
        const Pass = $("#Password").val();



        if (!Email) {
            setEmailError('Email is required');
            return;
        }

        if (!Pass) {
            setPasswordError('Password is required');
            return;
        }

        try {
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/User/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify({ Email: Email, Password: Pass }),
            });
            const data = await response.json();
            if (data.message) {
                setAlertMessage(data.message);
                setAlertModalOpen(true);
            } else {
                const Data = data.data;
                const UserID = Data.userId;
                if (cookies.user == UserID){
                    setVisible(false); //reallow access
                    setReloadIdleTimer(reloadIdleTime+1); //constantly increments by 1 to keep timer going once they relogin
                }
                else{ //they tried to relogin as someone else, no bueno
                    setAlertMessage("Can not relogin as another user");
                    setAlertModalOpen(true);
                }
            }
        } catch (error) {
            console.log(error); //debugging
            setAlertMessage("Could not log you in at this time. Please contact the system administrator.");
            setAlertModalOpen(true);
        }

    }
    function onClose(){
        setVisible(false);
        logout();
    }
    
    const bsLoginModal = (
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
            size="md"
            className="LoginModal"
            centered
            backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h2>Logged out due to Inactivity</h2>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                <h3>Re-login below</h3>
                    <Form className='d-flex flex-column'>
                        <div className='d-flex align-items-center'>
                            <Form.Label>
                                Email:
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Email"
                                id="Email"
                            >
                            </Form.Control>
                        </div>
                        {emailError && <div style={{ color: 'red', fontSize: '12px' }}>{emailError}</div>}
                        <div className='d-flex align-items-center'>
                            <Form.Label>
                                Password:
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                id="Password"
                            >
                            </Form.Control>
                        </div>
                        {passwordError && <div style={{ color: 'red', fontSize: '12px' }}>{passwordError}</div>}
                        <div className='d-flex justify-content-center'>
                            <Button type="button" onClick={HandleReLogin} className='ModalbuttonG'>Login</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
        
    
    )
    return bsLoginModal;
    
}


export default ManageLoginStatus