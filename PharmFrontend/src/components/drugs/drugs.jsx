// React import
import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies();

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

// Import modals
import "@components/modals/modalStyles.css";
import AddDrugModal from '@components/modals/addDrugModal';
import DeleteDrugModal from '@components/modals/deleteDrugModal';
import EditDrug from '@components/drugs/editdrug';
import BulkDrugs from '@components/drugs/bulkdrugs';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
function Drugs() {

    // UseStates for drug data
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
    const [selectedDrug, setSelectedDrug] = useState({ "DIN": null, selected: false });

    // Map the headers to the data for the table
    const headerMapping = {
        "DIN": "DIN",
        "name": "Drug Name",
        "dosage": "Dosage",
        "strength": "Strength",
        "manufacturer": "Manufacturer",
        "concentration": "Concentration",
        "referenceBrand": "ReferenceBrand",
        "containerSize": "Container Size"
    };

    // Get the drugs
    const GetDrugs = async () => {
        try {
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Drug/getdrugs', {
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
                        // Decode HTML entities
                        "DIN": he.decode(item.din),
                        "Drug Name": he.decode(item.name),
                        "Dosage": he.decode(item.dosage),
                        "Strength": he.decode(item.strength),
                        "Manufacturer": he.decode(item.manufacturer),
                        "Concentration": he.decode(item.concentration),
                        "Reference Brand": he.decode(item.referenceBrand),
                        "Container Size": he.decode(item.containerSize)
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
            alert("Error getting drugs. Please try again.");
            console.error(error);
            setDataObtained(false);
        }
    }

    // Handle radio change
    const handleRadioChange = (e, item) => {
        if (e.target.checked) {
            setSelectedDrug({ ...item, selected: true });
            setDisplay("main");
        }
    }

    // Handle delete button click
    const handleDeleteClick = () => {
        if (selectedDrug.selected) {
            setIsDeleteModalOpen(true);
        }
        else {
            alert("Please select a drug to delete.");
        }
    }

    // Get the drugs initially on page load
    useEffect(() => {
        GetDrugs();
    }, []);

    // Attempt to obtain drug data until success (max 3 attempts, 1 second interval)
    useEffect(() => {
        let attempts = 0;
        const interval = setInterval(() => {
            if (!dataObtained && attempts < 3) {
                GetDrugs();
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

    // Filter drug data on search box input
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
    }, [selectedDrug]);

    // Update the data when the modals are closed
    useEffect(() => {
        const fetchData = async () => {
            if (!isAddModalOpen && !isDeleteModalOpen) {
                // If both modals are closed, fetch the data
                await GetDrugs();
            }
        };

        fetchData();
    }, [isAddModalOpen, isDeleteModalOpen]);

    const ChangeDisplay = (e) => {
        let select = e.target.id;
        if (select === "bulkDrug") {
            setDisplay("bulkDrug");
        }
        if (select === "editDrug") {
            if (selectedDrug.selected) {
                setDisplay("editDrug");
            }
            else {
                alert("Please select a drug to edit.");
            }
        }
    }

    useEffect(() => {
        switch (display) {
            case "main":
                setContent(null);
                break;
            case "bulkDrug":
                setContent(<BulkDrugs setDisplay={setDisplay} />);
                break;
            case "editDrug":
                setContent(<EditDrug key={selectedDrug["DIN"]} setDisplay={setDisplay} setSelectedDrug={setSelectedDrug} selectedDrug={selectedDrug} />)
                break;
        }
    }, [display, setContent]);
    
    return(

        <div>
            <h1>Drugs List</h1>
            <hr/>

            <input type="text" id="drugSearch" placeholder="Search Drugs" value={search} onChange={e => setSearch(e.target.value)}/>
            <br/><br/>

            {/* Only display the admin required buttons if the user is an admin */}
            {cookies.get('admin') === 'Y' && (
                <div id="adminReqired">
                    {/* Add and Delete buttons open modals, whereas Bulk Add and Edit add a form to the {content} for their respective operation */}
                    <button id="addDrug" onClick={() => {setIsAddModalOpen(true)}}>Add Drug</button>
                        <AddDrugModal
                            isOpen={isAddModalOpen}
                            onClose={() => setIsAddModalOpen(false)}
                        />
                    <button id="bulkDrug" onClick={ChangeDisplay}>Bulk Add</button>
                    <button id="editDrug" onClick={ChangeDisplay}>Edit Drug</button>
                    <button id="deleteDrug" onClick={handleDeleteClick}>Delete Drug</button>
                        <DeleteDrugModal 
                            isOpen={isDeleteModalOpen} 
                            onClose={() => setIsDeleteModalOpen(false)} 
                            onDelete={() => GetDrugs()} //added for refresh
                            drugToDelete={selectedDrug}
                            setDrugToDelete={setSelectedDrug}
                        />
                    <br/><br/>
                    <i>&nbsp;&nbsp;*For editing or deleting a drug, select a drug from the table below, then click the corresponding button.</i>
                </div>
            )}

            {content}
            
            {/* Displays when data has not been obtained */}
            {!dataObtained && (
                <label>{dataError ? "Error fetching data" : "Fetching Data..."}</label>
            )}

            {/* Displays when data has been obtained */}
            {dataObtained && (
                <div className='scroll-table'>
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
                                            checked={selectedDrug.selected && item["DIN"] === selectedDrug["DIN"]}
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
                </div>
            )}
        </div>

    )

}

export default Drugs;