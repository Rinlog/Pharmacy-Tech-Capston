import $ from 'jquery';
import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import AlertModal from "@components/modals/alertModal";
import Dropdown from 'react-bootstrap/Dropdown';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function PatientLookupModal({visible, setVisible,setPatient}){

    //Search related
    const [SearchBy, setSearchBy] = useState("fName");
    const [SearchByDisplay,setSearchByDisplay] = useState("First Name");
    //modal alert stuff
    const [AlertModalOpen, setAlertModalOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState();

    //Patient stuff
    const [Patients, setPatients] = useState([]); //for holding the table data

    const [PatientData, setPatientData] = useState();
    const [OG_PatientData, setOG_PatientData] = useState([]);
    const [FetchedData, setFetchedData] = useState(false);
    const [RadioSelected, setRadioSelected] = useState(false);
    const Headers = (
        <tr>
            <th></th>
            <th>Patient ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>DOB</th>
            <th>Sex</th>
            <th>Address</th>
            <th>City</th>
            <th>Hospital</th>
            <th>Room Number</th>
            <th>Unit Number</th>
            <th>Allergies</th>
            <th>Conditions</th>
        </tr>
    )
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalPatientData = OG_PatientData //makes sure we start searching with every search option included.
        if (SearchTerm != ""){
            let FilteredPatients = LocalPatientData.filter(function(Patient){
            
                let result = expression.test(Patient[SearchBy]);
                if (result === true){
                    return true;
                }
                else{
                    return false;
                }
            })
            setPatientData(FilteredPatients);
        }
        else{
            setPatientData(OG_PatientData);
        }
    }

    function HandleSelect(Patient){
        setPatient(Patient); //on the add order and ammend order page, it gets formatted
        setRadioSelected(true);
    }
    
    //used for when page first loads
    useEffect( function(){
        const Interval = setInterval(function(){
            if (FetchedData == false){
                getPatients();
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
        let TempPatient = [];
        if (PatientData != undefined && PatientData != null && PatientData != ''){
            PatientData.forEach(function(Patient){
                TempPatient.push(
                    <tr key={Patient.ppr}>
                        <td><input type="radio" name="Patientradio" onClick={function(e){HandleSelect(Patient)}}></input></td>
                        <td>{Patient.ppr}</td>
                        <td>{Patient.fName}</td>
                        <td>{Patient.lName}</td>
                        <td>{Patient.dob.split(" ")[0]}</td>
                        <td>{Patient.sex}</td>
                        <td>{Patient.address}</td>
                        <td>{Patient.city}</td>
                        <td>{Patient.hospitalName}</td>
                        <td>{Patient.roomNumber}</td>
                        <td>{Patient.unitNumber}</td>
                        <td>{Patient.allergies}</td>
                        <td>{Patient.conditions}</td>
                    </tr>
                )
            })
            setPatients(TempPatient);
        }
    },[PatientData])
    async function getPatients(){
        let data = await $.ajax({
            url:'https://'+BackendIP+':'+BackendPort+'/api/Patient/getPatients',
            method:"POST",
            headers:{
                'Content-Type': 'application/json',
                'Key-Auth':ApiAccess
            }
        })
        data = data.data;
        setOG_PatientData(data);
        setPatientData(data);
        setFetchedData(true);

    }

    function onClose(){
        setFetchedData(false);
        setVisible(false);
    }
    function SelectPatient(){
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
                        <h2>Select Patient Below</h2>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                        {FetchedData ? (
                            <div>
                                <div className='d-flex align-items-center'>
                                    <div>
                                        <input type="text" id="drugSearch" placeholder={"Search by "+SearchByDisplay} onChange={e => Search(e.target.value)}/>
                                    </div>
                                    <Dropdown>
                                        <Dropdown.Toggle className='HideButtonCSS SearchTypeButton'>
                                            <svg width={30} height={35} viewBox="1 -4 30 30" preserveAspectRatio="xMinYMin meet" >
                                                <rect id="svgEditorBackground" x="0" y="0" width="10px" height="10px" style={{fill: 'none', stroke: 'none'}}/>
                                                <circle id="e2_circle" cx="10" cy="10" style={{fill:'white',stroke:'black',strokeWidth:'2px'}} r="5"/>
                                                <line id="e3_line" x1="14" y1="14" x2="20.235" y2="20.235" style={{fill:'white',stroke:'black',strokeWidth:'2px'}}/>
                                            </svg>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item id="ppr" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("Patient ID");
                                            }}>Patient ID</Dropdown.Item>
                                            <Dropdown.Item id="fName" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("First Name");
                                            }}>First Name</Dropdown.Item>
                                            <Dropdown.Item id="lName" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("Last Name");
                                            }}>Last Name</Dropdown.Item>
                                            <Dropdown.Item id="dob" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("Date of Birth");
                                            }}>Date of Birth</Dropdown.Item>
                                            <Dropdown.Item id="sex" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("Sex");
                                            }}>Sex</Dropdown.Item>
                                            <Dropdown.Item id="address" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("Address");
                                            }}>Address</Dropdown.Item>
                                            <Dropdown.Item id="city" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("City");
                                            }}>City</Dropdown.Item>
                                            <Dropdown.Item id="hospitalName" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("Hospital");
                                            }}>Hospital</Dropdown.Item>
                                            <Dropdown.Item id="roomNumber" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("Room #");
                                            }}>Room #</Dropdown.Item>
                                            <Dropdown.Item id="unitNumber" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("Unit #");
                                            }}>Unit #</Dropdown.Item>
                                            <Dropdown.Item id="allergies" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("Allergies");
                                            }}>Allergies</Dropdown.Item>
                                            <Dropdown.Item id="conditions" onClick={(e)=>{setSearchBy(e.target.id)
                                                setSearchByDisplay("Conditions");
                                            }}>Conditions</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <table>
                                        <thead>
                                            {Headers}
                                        </thead>
                                        <tbody>
                                            {Patients}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='d-flex justify-content-center'>
                                    <Button type="button" onClick={SelectPatient} className='ModalbuttonG w-100'>Confirm</Button>
                                </div>
                            </div>
                        ) : "Fetching Data..."}
                </Modal.Body>
            </Modal>
        </div>
    )
}
export default PatientLookupModal;