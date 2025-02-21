import $, { fn } from 'jquery';
import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import AlertModal from "@components/modals/alertModal";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function PhysicianLookupModal({visible, setVisible,setPhysician}){

    //modal alert stuff
    const [AlertModalOpen, setAlertModalOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState();

    //Physician stuff
    const [Physicians, setPhysicians] = useState([]); //for holding the table data

    const [PhysicianData, setPhysicianData] = useState();
    const [OG_PhysicianData, setOG_PhysicianData] = useState([]);
    const [FetchedData, setFetchedData] = useState(false);
    const [RadioSelected, setRadioSelected] = useState(false);
    const Headers = (
        <tr>
            <th></th>
            <th>Physician ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Province</th>
        </tr>
    )
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalPhysicianData = OG_PhysicianData //makes sure we start searching with every search option included.
        if (SearchTerm != ""){
            let FilteredPhysicians = LocalPhysicianData.filter(function(Physician){
            
                let result = expression.test(Physician["fName"]);
                if (result === true){
                    return true;
                }
                else{
                    return false;
                }
            })
            setPhysicianData(FilteredPhysicians);
        }
        else{
            setPhysicianData(OG_PhysicianData);
        }
    }

    function HandleSelect(Physician){
        setPhysician(Physician); //on the add order and ammend order page, it gets formatted
        setRadioSelected(true);
    }
    
    //used for when page first loads
    useEffect( function(){
        const Interval = setInterval(function(){
            if (FetchedData == false){
                getPhysicians();
            }
            else{
                clearInterval(Interval);
            }
        },200)
        return (
            function(){
                clearInterval(Interval);
            }
        )
    },[FetchedData])
    useEffect(function(){
        let TempPhysician = [];
        if (PhysicianData != undefined && PhysicianData != null && PhysicianData != ''){
            PhysicianData.forEach(function(Physician){
                TempPhysician.push(
                    <tr key={Physician.physicianID}>
                        <td><input type="radio" name="Physicianradio" onClick={function(e){HandleSelect(Physician)}}></input></td>
                        <td>{Physician.physicianID}</td>
                        <td>{Physician.fName}</td>
                        <td>{Physician.lName}</td>
                        <td>{Physician.city}</td>
                        <td>{Physician.province}</td>
                    </tr>
                )
            })
            setPhysicians(TempPhysician);
        }
    },[PhysicianData])
    async function getPhysicians(){
        let data = await $.ajax({
            url:'https://'+BackendIP+':'+BackendPort+'/api/physician/getphysicians',
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'Key-Auth':ApiAccess
            }
        })
        data = data.data;
        setOG_PhysicianData(data);
        setPhysicianData(data);
        setFetchedData(true);

    }

    function onClose(){
        setFetchedData(false);
        setVisible(false);
    }
    function SelectPhysician(){
        if (RadioSelected == true){
            onClose();
            setRadioSelected(false);
        }
        
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
                        <h2>Select Physician Below</h2>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                        {FetchedData ? (
                            <div>
                                <Form>
                                    <Form.Control className='InputBackroundColor' type="text" placeholder='Search...' onChange={function(e){Search(e.target.value)}}></Form.Control>
                                </Form>
                                <div className='d-flex justify-content-center'>
                                    <table>
                                        <thead>
                                            {Headers}
                                        </thead>
                                        <tbody>
                                            {Physicians}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <Button type="button" onClick={SelectPhysician} className='ModalbuttonG w-100'>Confirm</Button>
                                </div>
                            </div>
                        ) : "Fetching Data..."}
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default PhysicianLookupModal;