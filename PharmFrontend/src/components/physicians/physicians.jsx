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
import SortByHeader from '@components/headerSort/sortByHeader';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

function Physicians() {

    // UseStates for physician data
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
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
    const [selectedPhysician, setSelectedPhysician] = useState({ "Physician ID": null, selected: false });
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

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
                const keys = Object.keys(transformedData[0]);

                // Map the custom versions
                const customHeaders = keys.map(key => headerMapping[key] || key);
                setTableHeaders(customHeaders);
                setDataObtained(true);
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
    const handleRadioChange = (e, item) => {
        if (e.target.checked) {
            setSelectedPhysician({ ...item, selected: true });
            setDisplay("main");
        }
    }

    // Handle delete button click
    const handleDeleteClick = () => {
        if (selectedPhysician.selected) {
            setIsDeleteModalOpen(true);
        }
        else {
            setAlertMessage("Please select a physician to delete.");
            setIsAlertModalOpen(true);
        }
    }

    // Get the physicians initially on page load
    useEffect(() => {
        GetPhysicians();
    }, []);

    // Filter physician data on search box input
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
    }, [selectedPhysician]);

    // Update the data when the modals are closed
    useEffect(() => {
        const fetchData = async () => {

        if (!isAddModalOpen && !isDeleteModalOpen) {

            // If both modals are closed, fetch the data
            await GetPhysicians();
            setTimeout(function(){
                if (column !== null) {
                    headerSort(column, false);
                }
            }, 10)
        }
    };
    fetchData();
    }, [isAddModalOpen, isDeleteModalOpen]);

    const ChangeDisplay = (e) => {
        let select = e.target.id;
        if (select === "bulkPhysician") {
            setDisplay("bulkPhysician");
        }
        if (select === "editPhysician") {
            if (selectedPhysician.selected) {
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
                setContent(<BulkPhysicians setDisplay={setDisplay} />);
                break;
            case "editPhysician":
                setContent(<EditPhysician key={selectedPhysician["Physician ID"]} setDisplay={setDisplay} setSelectedPhysician={setSelectedPhysician} selectedPhysician={selectedPhysician} getPhysicians={GetPhysicians}/>)
                break;
        }
    }, [display, setContent]);

    //function to handle sorting when a header is clicked
        const headerSort = (header,swap) => {
    
            //this sets a use state header so that when the page is updated it will re-sort
    
            //toggle sort order if clicking the same column, otherwise it will do ascending
            
            if (swap == true){
                let newSortOrder = 'asc';
                if (column === header && sortOrder === 'asc') {
                    newSortOrder = 'desc';
                }
                setColumn(header);
                setOrder(newSortOrder);
                let sortedData = SortByHeader(filteredData,header,newSortOrder);
                setFilteredData(sortedData);
            }
            else{
                let sortedData = SortByHeader(filteredData,header,sortOrder);
                setColumn(header);
                setFilteredData(sortedData);
    
            }
        };

        //needs to be in here for a proper update to the list when deleteing
        const handleSuccessfulDelete = (deletedPhysician) => {

        const updatedData = [];
        for (const item of data) {
             
             if (item.physicianID !== deletedPhysician) {
                 updatedData.push(item);
             }
         }
         
        const updatedFilteredData = [];
         for (const item of filteredData) {
             
             if (item.physicianID !== deletedPhysician) {
                 updatedFilteredData.push(item);
             }
         }
 
         setData(updatedData);
         setFilteredData(updatedFilteredData);
       };
    
    return(

        <div>
            <div className='page-header-name'>Physicians List</div>
            <hr/>

            <input type="text" id="physicianSearch" placeholder="Search Physicians" value={search} onChange={e => setSearch(e.target.value)}/>
            <br/><br/>

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
                            onDelete={() => {
                                //handleSuccessfulDelete needs to be in here for a proper refresh of the list when deleting
                                handleSuccessfulDelete(selectedPhysician["Physician ID"]);
                                GetPhysicians() //added for refresh
                            }}
                            physicianToDelete={selectedPhysician}
                            setPhysicianToDelete={setSelectedPhysician}
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
                                <th key={header} onClick={() => headerSort(header,true)} style={{cursor: 'pointer'}}>
                                    {header} {column === header ? (sortOrder === 'asc' ? '▲' : '▼') : ''}</th>
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
                                        checked={selectedPhysician.selected && item["Physician ID"] === selectedPhysician["Physician ID"]}
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

export default Physicians;