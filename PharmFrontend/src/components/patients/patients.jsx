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

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

function Patients() {

    // UseStates for patient data
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false);
    const [dataError, setDataError] = useState(false);

    // UseStates to manage displaying the bulk add and edit functionality
    const [display, setDisplay] = useState("main");
    const [content, setContent] = useState(null);


    // Modal things
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState({ "Patient ID": null, selected: false });

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
            // Call the API
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
                const keys = Object.keys(transformedData[0]);

                // Map the custom versions
                const customHeaders = keys.map(key => headerMapping[key] || key);
                setTableHeaders(customHeaders);
                setDataObtained(true);
                setDataError(false);

            }
        } catch (error) {
            alert("Error getting patients. Please try again.");
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
            alert("Please select a patient to delete.");
        }
    }

    // Get the patients initially on page load
    useEffect(() => {
        GetPatients();
    }, []);

    // Attempt to obtain patient data until success (max 3 attempts, 1 second interval)
    useEffect(() => {
        let attempts = 0;
        const interval = setInterval(() => {
            if (!dataObtained && attempts < 3) {
                GetPatients();
                attempts++;
            }
            else {
                if (attempts >= 3) {
                    // If we've tried 3 times and still haven't gotten the data, set an error to display
                    setDataError(true);
                }
                clearInterval(interval);
            }
        }, 1000);

        // Cleanup function
        return () => clearInterval(interval);
    }, []); // Empty dependency array to run the effect once on mount

    // Filter patient data on search box input
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

    useEffect(() => {
    }, [selectedPatient]);

    // Update the data when the modals are closed
    useEffect(() => {
        if (!isAddModalOpen && !isDeleteModalOpen) {
            // If both modals are closed, fetch the data
            GetPatients();
        }
    }, [isAddModalOpen, isDeleteModalOpen, display]);

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
                alert("Please select a patient to edit.");
            }
        }
    }

    useEffect(() => {
        switch (display) {
            case "main":
                setContent(null);
                break;
            case "bulkPatient":
                setContent(<BulkPatients setDisplay={setDisplay} />);
                break;
            case "editPatient":
                setContent(<EditPatient key={selectedPatient["Patient ID"]} setDisplay={setDisplay} setSelectedPatient={setSelectedPatient} selectedPatient={selectedPatient} />)
                break;
        }
    }, [display, setContent]);
    
    return(

        <div>
            <h1>Patients List</h1>
            <hr/>

            <input type="text" id="patientSearch" placeholder="Search Patients" value={search} onChange={e => setSearch(e.target.value)}/>
            <br/><br/>

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
                            onDelete={() => GetPatients()}
                            onClose={() => setIsDeleteModalOpen(false)} 
                            patientToDelete={selectedPatient}
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
                                <th key={header}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((item, index) => (
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