// React import
import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies();

// Import modals
import "@components/modals/modalStyles.css";
import AddPhysicianModal from '@components/modals/addPhysicianModal';
import DeletePhysicianModal from '@components/modals/deletePhysicianModal';
import EditPhysician from '@components/physicians/editphysician';
import BulkPhysicians from '@components/physicians/bulkphysicians';
import AlertModal from '../modals/alertModal';

import Dropdown from 'react-bootstrap/Dropdown';
import headerSort from '@components/headerSort/HeaderSort';
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

function Physicians() {

    // UseStates for physician data
    const [SearchBy, setSearchBy] = useState("First Name");
    const [OG_data, setOG_Data] = useState([]);
    const [Data, setData] = useState([]);

    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false);
    const [dataError, setDataError] = useState(false);

    //multiple delete
    const [selectedPhysicians, setSelectedPhysicians] = useState([]);

    //table sorting
    const [column, setColumn] = useState(null);
    const [sortOrder, setOrder] = useState('desc');
    // UseStates to manage displaying the bulk add and edit functionality
    const [display, setDisplay] = useState("main");
    const [content, setContent] = useState(null);

    // Modal things
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPhysician, setSelectedPhysician] = useState({ "Physician ID": null, selected: false });
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    //textbox changes
    const handleSelectionChange = (e, item) => {
        const {checked} = e.target;
        const physicianID = item["Physician ID"];
        const physicianName = item["First Name"] + " " + item["Last Name"];

        if (checked) {
            //selected box gets added
            setSelectedPhysicians(prev => [...prev, {PhysicianID: physicianID, name: physicianName}]);
            //if its only one selected set it as new
            if (selectedPhysicians.length === 0) {
                setSelectedPhysician(item);
                //console.log(item); //debugging
            }
        }
        else {
            //when unchecking a box update the array
            setSelectedPhysicians(prev => {
                const updated = prev.filter(physician => physician.PhysicianID !== physicianID);
                //if nothing is selected clear the array
                if (updated.length === 0) {
                    setSelectedPhysician(null);

                    if (display === "editPhysician") {
                        setDisplay("main");
                    }
                }
                //console.log(updated); //debugging
                return updated;
            })
        }
    }

    // Map the headers to the data for the table
    const headerMapping = {
        "PhysicianID": "Physician ID",
        "FName": "First Name",
        "LName": "Last Name",
        "City": "City",
        "Province": "Province"
    };

    // Get the physicians
    const GetPhysicians = async () => {
        try {
            setDataObtained(false);
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Physician/getphysicians', {
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

            if (fetchedData.data.length > 0) {

                
                // We got data, so transform it
                const transformedData = fetchedData.data.map(item => {
                    return {
                        "Physician ID": he.decode(item.physicianID),
                        "First Name": he.decode(item.fName),
                        "Last Name": he.decode(item.lName),
                        "City": he.decode(item.city),
                        "Province": he.decode(item.province)
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
                },20);
                setDataError(false);

            }
        } catch (error) {
            setAlertMessage("Error getting physicians. Please try again.");
            setIsAlertModalOpen(true);
            console.error(error);
            setDataObtained(false);
        }
    }

    // Handle radio change
    // const handleRadioChange = (e, item) => {
    //     if (e.target.checked) {
    //         setSelectedPhysician({ ...item, selected: true });
    //         setDisplay("main");
    //     }
    // }

    // Handle delete button click
    const handleDeleteClick = () => {
        if (selectedPhysicians.length > 0) {
            const physicianToDelete = selectedPhysicians.map(physician => ({
                physicianID: physician.PhysicianID,
                name: physician.name
            }));
            setSelectedPhysicians(physicianToDelete);
            setIsDeleteModalOpen(true);
        }
        else {
            setAlertMessage("Please select at least one physician to delete");
            setIsAlertModalOpen(true);
        }
    }

    // Filter Physician data on search box input
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalData = OG_data //makes sure we start searching with every search option included.
        if (SearchTerm != ""){
            let FilteredData = LocalData.filter(function(Physician){
            
                let result = expression.test(Physician[SearchBy]);
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

    
    // Update the data when the modals are closed
    useEffect(() => {
        if (!isAddModalOpen && !isDeleteModalOpen) {
            // If both modals are closed, fetch the data
            GetPhysicians();
        }
    }, [isAddModalOpen, isDeleteModalOpen]);

    const ChangeDisplay = (e) => {
        let select = e.target.id;

        if (select === "bulkPhysician") {
            setDisplay("bulkPhysician");
        }
        if (select === "editPhysician") {

            if (selectedPhysicians.length === 1) {
                const currentSelectedPhysician = Data.find(physician => physician["Physician ID"] === selectedPhysicians[0].PhysicianID);

                setSelectedPhysician(currentSelectedPhysician);
                setDisplay("editPhysician");
            }
            else {
                setAlertMessage("Please select a physician to edit.");
                setIsAlertModalOpen(true);
            }
        }
    }

    useEffect(() => {
        switch (display) {
            case "main":
                setContent(null);
                break;
            case "bulkPhysician":
                setContent(<BulkPhysicians setDisplay={setDisplay} getPhysicians={GetPhysicians} />);
                break;
            case "editPhysician":
                setContent(<EditPhysician key={selectedPhysician["Physician ID"]} setDisplay={setDisplay} setSelectedPhysician={setSelectedPhysician} selectedPhysician={selectedPhysician} getPhysicians={GetPhysicians}/>)
                break;
        }
    }, [display, setContent]);
    return(

        <div>
            <div className='page-header-name'>Physicians List</div>
            <hr/>

            <div className='d-flex align-items-center'>
                <div>
                    <input type="text" id="drugSearch" placeholder={"Search by "+SearchBy} onChange={e => Search(e.target.value)}/>
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
                        <Dropdown.Item id="Physician ID" onClick={(e)=>{setSearchBy(e.target.id)}}>Physician ID</Dropdown.Item>
                        <Dropdown.Item id="First Name" onClick={(e)=>{setSearchBy(e.target.id)}}>First Name</Dropdown.Item>
                        <Dropdown.Item id="Last Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Last Name</Dropdown.Item>
                        <Dropdown.Item id="City" onClick={(e)=>{setSearchBy(e.target.id)}}>City</Dropdown.Item>
                        <Dropdown.Item id="Province" onClick={(e)=>{setSearchBy(e.target.id)}}>Province</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Only display the admin required buttons if the user is an admin */}
            {cookies.get('admin') === 'Y' && (
                <div id="adminReqired">
                    {/* Add and Delete buttons open modals, whereas Bulk Add and Edit add a form to the {content} for their respective operation */}
                    <button id="addPhysician" onClick={() => {setIsAddModalOpen(true)}}>Add Physician</button>
                        <AddPhysicianModal
                            isOpen={isAddModalOpen}
                            onClose={() => setIsAddModalOpen(false)}
                        />
                    <button id="bulkPhysician" onClick={ChangeDisplay}>Bulk Add</button>
                    <button id="editPhysician" onClick={ChangeDisplay}>Edit Physician</button>
                    <button id="deletePhysician" onClick={handleDeleteClick}>Delete Physician</button>
                        <DeletePhysicianModal 
                            isOpen={isDeleteModalOpen} 
                            onClose={() => setIsDeleteModalOpen(false)}
                            physicianToDelete={selectedPhysicians}
                            setPhysicianToDelete={setSelectedPhysicians}
                        />

                        <AlertModal
                            isOpen={isAlertModalOpen}
                            message={alertMessage}
                            onClose={() => setIsAlertModalOpen(false)}
                        />
                    <br/><br/>
                    <i>&nbsp;&nbsp;*For editing or deleting a physician, select a physician from the table below, then click the corresponding button.</i>
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
                                        type="checkbox" 
                                        checked={selectedPhysicians.some(physician => physician.PhysicianID === item["Physician ID"])}
                                        onChange={e => handleSelectionChange(e, item)}
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

export default Physicians;