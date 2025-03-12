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

<<<<<<< HEAD
    const [modalHeight, setModalHeight] = useState('auto');
    
    // UseStates for patient data
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false);
    const [dataError, setDataError] = useState(false);

    // Map the headers to the data for the table
    const headerMapping = {
        "ppr": "Patient ID",
        "fName": "First Name",
        "lName": "Last Name",
        "dob": "Date of Birth",
        "sex": "Sex",
        "address": "Address",
        "city": "City",
        "hospitalName": "Hospital",
        "roomNumber": "Room #",
        "unitNumber": "Unit #",
        "allergies": "Allergies",
        "conditions": "Conditions"
    };

    //state to confirm an option is selected
    const [radioChecked, setRadioChecked] = useState(false);

    // Get the drugs
    const GetPatients = async () => {

        try {

            //call the API
            const response = await fetch('https://localhost:7172/api/Patient/getpatients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // Get the data out of the response
            const fetchedData = await response.json();

            // If there is an issue with the response, alert the user
            if(response.status != 200) {
                alert(fetchedData.message);
            }

            if (fetchedData.data.length > 0) {

                
                // We got data, so transform it
                const transformedData = fetchedData.data.map(item => {
                    return {
                        "Patient ID": he.decode(item.ppr),
                        "First Name": he.decode(item.fName),
                        "Last Name": he.decode(item.lName),
                        "Date of Birth": he.decode(item.dob),
                        "Sex": he.decode(item.sex),
                        "Address": he.decode(item.address),
                        "City": he.decode(item.city),
                        "Hospital": he.decode(item.hospitalName),
                        "Room #": he.decode(item.roomNumber),
                        "Unit #": he.decode(item.unitNumber),
                        "Allergies": he.decode(item.allergies),
                        "Conditions": he.decode(item.conditions)
                    };
                });

                console.log(transformedData);

                setData(transformedData);
                const keys = Object.keys(transformedData[0]);

                // Map the custom versions
                const customHeaders = keys.map(key => headerMapping[key] || key);
                setTableHeaders(customHeaders);
                setDataObtained(true);
                setDataError(false);

            }

        }
        catch (error) {
            alert("Error getting patients. Please try again.");
            console.error(error);
            setDataObtained(false);
        }

    }

    //attempt to obtain user data until success
    useEffect(() => {

        if (!dataObtained) GetPatients();

    },[dataObtained]);

    //handle search
    useEffect(() => {
        if (data.length > 0) {
            const filtered = data.filter(item => {
                for (const key in item) {
                    if (item[key] && item[key].toString().toLowerCase().includes(search.toLowerCase())) {
                        return true;
                    }
                }
                return false;
            });
            setFilteredData(filtered);
        }
    }, [search, data]);

    // Handle select
    const handleSelect = (item) => {
        setPatient(item);
        setRadioChecked(true);
    }   

    //exit no selection
    const CloseNoSelection = () =>{
        setPatientIsOpen(false);
    }

    //exit with selection 
    const CloseWithSelection = () =>{
        setRadioChecked(false);
        setPatientIsOpen(false);
    }

    return(

        patientIsOpen && (
            <div className={`modal ${patientIsOpen ? 'isOpen' : ''}`} style={{ display: patientIsOpen ? 'flex' : 'none' }}>
                <div className="modal-content" style={{ height: modalHeight, width: '60%' }}>
                    <span className="close" onClick={CloseNoSelection}>&times;</span>    

                    {/* Displays when data has not been obtained */}
                    {!dataObtained && (
                        <label>{dataError ? "Error fetching data" : "Fetching Data..."}</label>
                    )}

                    {/* Displays when data has been obtained */}
                    {dataObtained && (
                        <>
                    <input type="text" className="text-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}></input>

                        <table>
                            <thead>
                                <tr>
                                    {/* Empty column for radio buttons */}
                                    <th></th>
                                    {tableHeaders.map(header => (
                                        <th key={header}>{header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item, index) => (
                                    <tr key={index}>

                                        {/* Add radio button for each row */}
                                        <td>
                                        <input
                                            type="radio"
                                            name="selectedRow"
                                            onChange={() => handleSelect(item)}
                                        />
                                        </td>

                                        {tableHeaders.map(header => (
                                            <td key={header}>{item[header]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="button" onClick={CloseWithSelection} disabled={radioChecked === false}>Confirm</button>
                        </>
                    )}

                    </div>
            </div>
        ) 
=======
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
>>>>>>> dev
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
                                    <small className='pl-1'>SearchBy:</small>
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