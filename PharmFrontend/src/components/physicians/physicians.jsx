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

    // UseStates to manage displaying the bulk add and edit functionality
    const [display, setDisplay] = useState("main");
    const [content, setContent] = useState(null);

    // Modal things
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPhysician, setSelectedPhysician] = useState({ "Physician ID": null, selected: false });

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
            const response = await fetch('https://localhost:7172/api/Physician/getphysicians', {
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
            alert("Error getting physicians. Please try again.");
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
            alert("Please select a physician to delete.");
        }
    }

    // Get the physicians initially on page load
    useEffect(() => {
        GetPhysicians();
    }, []);

    // Attempt to obtain physician data until success (max 3 attempts, 1 second interval)
    useEffect(() => {
        let attempts = 0;
        const interval = setInterval(() => {
            if (!dataObtained && attempts < 3) {
                GetPhysicians();
                attempts++;
            }
            else {
                if (attempts === 3) {
                    // If we've tried 3 times and still haven't gotten the data, set an error to display
                    setDataError(true);
                }
                clearInterval(interval);
            }
        }, 1000);

        // Cleanup function
        return () => clearInterval(interval);
    }, []); // Empty dependency array to run the effect once on mount

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
        if (!isAddModalOpen && !isDeleteModalOpen) {
            // If both modals are closed, fetch the data
            GetPhysicians();
        }
    }, [isAddModalOpen, isDeleteModalOpen, display]);

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
                alert("Please select a physician to edit.");
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
                setContent(<EditPhysician key={selectedPhysician["Physician ID"]} setDisplay={setDisplay} setSelectedPhysician={setSelectedPhysician} selectedPhysician={selectedPhysician} />)
                break;
        }
    }, [display, setContent]);
    
    return(

        <div>
            <h1>Physicians List</h1>
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
                            onDelete={() => GetPhysicians()} //added for refresh
                            physicianToDelete={selectedPhysician}
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