// React import
import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies();

// Import modals
import "@components/modals/modalStyles.css";
import AddPatientModal from '@components/modals/addPatientModal';
import DeletePatientModal from '@components/modals/deletePatientModal';
import EditPatient from '@components/patients/editpatient';
import BulkPatients from '@components/patients/bulkpatients';
import AlertModal from '../modals/alertModal';
import Dropdown from 'react-bootstrap/Dropdown';
import headerSort from '@components/headerSort/HeaderSort';
// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function Patients() {

    // UseStates for patient data
    const [SearchBy, setSearchBy] = useState("First Name");
    const [OG_data, setOG_Data] = useState([]);
    const [Data, setData] = useState([]);

    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false);
    const [dataError, setDataError] = useState(false);

    //table sorting
    const [column, setColumn] = useState(null);
    const [sortOrder, setOrder] = useState('desc');

    // UseStates to manage displaying the bulk add and edit functionality
    const [display, setDisplay] = useState("main");
    const [content, setContent] = useState(null);


    // Modal things
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState({ "Patient ID": null, selected: false });
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

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

    // Get the patients
    const GetPatients = async () => {
        try {
            setDataObtained(false);
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Patient/getpatients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
            });
            // Get the data out of the response
            const fetchedData = await response.json();

            // If there is an issue with the response, alert the user
            if(response.status != 200) {
                setAlertMessage(fetchedData.message);
                setIsAlertModalOpen(true);
                return;
            }

            // Remove the time from DOB (YYYY-MM-DD HH:MM:SS AM/PM -> YYYY-MM-DD)
            fetchedData.data.forEach(item => {
                item.dob = item.dob.split(' ')[0];
            });
            

            if (fetchedData.data.length > 0) {

                
                // We got data, so transform it
                const transformedData = fetchedData.data.map(item => {
                    return {
                        "Patient ID": he.decode(item.ppr),
                        "First Name": he.decode(item.fName),
                        "Last Name": he.decode(item.lName),
                        "Date of Birth": item.dob,
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

                setData(transformedData);
                setOG_Data(transformedData);
                const keys = Object.keys(transformedData[0]);

                // Map the custom versions
                const customHeaders = keys.map(key => headerMapping[key] || key);
                setTableHeaders(customHeaders);
                setTimeout(function(){
                    setDataObtained(true);
                },20)
                setDataError(false);

            }
        } catch (error) {
            setAlertMessage("Error getting patients. Please try again.");
            setIsAlertModalOpen(true);
            console.error(error);
            setDataObtained(false);
        }
    }

    // Handle radio change
    const handleRadioChange = (e, item) => {
        if (e.target.checked) {
            setSelectedPatient({ ...item, selected: true });
            setDisplay("main");
        }
    }

    // Handle delete button click
    const handleDeleteClick = () => {
        if (selectedPatient.selected) {
            setIsDeleteModalOpen(true);
        }
        else {
            setAlertMessage("Please select a patient to delete.");
            setIsAlertModalOpen(true);
        }
    }

    // Filter patient data on search box input
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalData = OG_data //makes sure we start searching with every search option included.
        if (SearchTerm != ""){
            let FilteredData = LocalData.filter(function(Patient){
            
                let result = expression.test(Patient[SearchBy]);
                if (result === true){
                    return true;
                }
                else{
                    return false;
                }
            })
            setData(FilteredData);
        }
        else{
            setData(OG_data);
        }
    }
    useEffect(function(){
            if (column !== null){
                headerSort(column,false,column, setColumn,sortOrder, setOrder, Data, setData); //tells it not to swap the order from asc/desc, just re-sort
            }
    },[Data])

    // Update the data when the modals are closed this also loads the table in initially
    useEffect(() => {
        if (!isAddModalOpen && !isDeleteModalOpen) {
            // If both modals are closed, fetch the data
            GetPatients();
        }
    }, [isAddModalOpen, isDeleteModalOpen]);

    const ChangeDisplay = (e) => {
        let select = e.target.id;
        if (select === "bulkPatient") {
            setDisplay("bulkPatient");
        }
        if (select === "editPatient") {
            if (selectedPatient.selected) {
                setDisplay("editPatient");
            }
            else {
                setAlertMessage("Please select a patient to edit.");
                setIsAlertModalOpen(true);
            }
        }
    }

    useEffect(() => {
        switch (display) {
            case "main":
                setContent(null);
                break;
            case "bulkPatient":
                setContent(<BulkPatients setDisplay={setDisplay} getPatients={GetPatients}/>);
                break;
            case "editPatient":
                setContent(<EditPatient key={selectedPatient["Patient ID"]} setDisplay={setDisplay} setSelectedPatient={setSelectedPatient} selectedPatient={selectedPatient} getPatients={GetPatients}/>)
                break;
        }
    }, [display, setContent]);

        
    
    return(

        <div>
            <div className='page-header-name'>Patients List</div>
            <hr/>

            <div className='d-flex align-items-center'>
                <div>
                    <input type="text" id="drugSearch" placeholder={"Search by "+SearchBy} onChange={e => Search(e.target.value)}/>
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
                        <Dropdown.Item id="Patient ID" onClick={(e)=>{setSearchBy(e.target.id)}}>Patient ID</Dropdown.Item>
                        <Dropdown.Item id="First Name" onClick={(e)=>{setSearchBy(e.target.id)}}>First Name</Dropdown.Item>
                        <Dropdown.Item id="Last Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Last Name</Dropdown.Item>
                        <Dropdown.Item id="Date of Birth" onClick={(e)=>{setSearchBy(e.target.id)}}>Date of Birth</Dropdown.Item>
                        <Dropdown.Item id="Sex" onClick={(e)=>{setSearchBy(e.target.id)}}>Sex</Dropdown.Item>
                        <Dropdown.Item id="Address" onClick={(e)=>{setSearchBy(e.target.id)}}>Address</Dropdown.Item>
                        <Dropdown.Item id="City" onClick={(e)=>{setSearchBy(e.target.id)}}>City</Dropdown.Item>
                        <Dropdown.Item id="Hospital" onClick={(e)=>{setSearchBy(e.target.id)}}>Hospital</Dropdown.Item>
                        <Dropdown.Item id="Room #" onClick={(e)=>{setSearchBy(e.target.id)}}>Room #</Dropdown.Item>
                        <Dropdown.Item id="Unit #" onClick={(e)=>{setSearchBy(e.target.id)}}>Unit #</Dropdown.Item>
                        <Dropdown.Item id="Allergies" onClick={(e)=>{setSearchBy(e.target.id)}}>Allergies</Dropdown.Item>
                        <Dropdown.Item id="Conditions" onClick={(e)=>{setSearchBy(e.target.id)}}>Conditions</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Only display the admin required buttons if the user is an admin */}
            {cookies.get('admin') === 'Y' && (
                <div id="adminReqired">
                    {/* Add and Delete buttons open modals, whereas Bulk Add and Edit add a form to the {content} for their respective operation */}
                    <button id="addPatient" onClick={() => {setIsAddModalOpen(true)}}>Add Patient</button>
                        <AddPatientModal
                            isOpen={isAddModalOpen}
                            onClose={() => setIsAddModalOpen(false)}
                        />
                    <button id="bulkPatient" onClick={ChangeDisplay}>Bulk Add</button>
                    <button id="editPatient" onClick={ChangeDisplay}>Edit Patient</button>
                    <button id="deletePatient" onClick={handleDeleteClick}>Delete Patient</button>
                        <DeletePatientModal 
                            isOpen={isDeleteModalOpen} 
                            onClose={() => setIsDeleteModalOpen(false)} 
                            patientToDelete={selectedPatient}
                            setPatientToDelete={setSelectedPatient}
                        />

                        <AlertModal
                            isOpen={isAlertModalOpen}
                            message={alertMessage}
                            onClose={() => setIsAlertModalOpen(false)}
                        />
                    <br/><br/>
                    <i>&nbsp;&nbsp;*For editing or deleting a patient, select a patient from the table below, then click the corresponding button.</i>
                </div>
            )}

            {content}
            
            {/* Displays when data has not been obtained */}
            {!dataObtained && (
                <label>{dataError ? "Error fetching data" : "Fetching Data..."}</label>
            )}

            {/* Displays when data has been obtained */}
            {dataObtained && (
                <table>
                    <thead>
                        <tr>
                            {/* Empty column for radio buttons */}
                            <th></th>
                            {tableHeaders.map(header => (
                                <th key={header} onClick={() => headerSort(header,true,column, setColumn,sortOrder, setOrder, Data, setData)} style={{cursor: 'pointer'}}>
                                    {header} {column === header ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Data.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <input 
                                        type="radio" 
                                        name="selectedRow" 
                                        checked={selectedPatient.selected && item["Patient ID"] === selectedPatient["Patient ID"]}
                                        onChange={e => handleRadioChange(e, item)}
                                    />
                                </td>
                                {tableHeaders.map(header => (
                                    <td key={header}>{item[header]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>

    )

}

export default Patients;