// React import
import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
const cookies = new Cookies();

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

// Import modals
import AddDrugModal from '@components/modals/addDrugModal';
import DeleteDrugModal from '@components/modals/deleteDrugModal';
import EditDrug from '@components/drugs/editdrug';
import BulkDrugs from '@components/drugs/bulkdrugs';
import AlertModal from '../modals/alertModal';
import headerSort from '@components/headerSort/HeaderSort';

import Dropdown from 'react-bootstrap/Dropdown';
const ApiAccess = import.meta.env.VITE_APIAccess
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
function Drugs() {

    // UseStates for drug data
    const [SearchBy, setSearchBy] = useState("Drug Name");
    const [OG_data, setOG_Data] = useState([]);
    const [Data, setData] = useState([]);

    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false);
    const [dataError, setDataError] = useState(false);

    //delete multiple drugs
    const [selectedDrugs, setSelectedDrugs] = useState([]);

    //table sorting
    const [column, setColumn] = useState(null);
    const [sortOrder, setOrder] = useState('desc');
    // UseStates to manage displaying the bulk add and edit functionality
    const [display, setDisplay] = useState("main");
    const [content, setContent] = useState(null);

    // Modal things
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedDrug, setSelectedDrug] = useState({ "DIN": null, selected: false });
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);


    //checkbox changes
    const handleSelectionChange = (e, item) => {
        const { checked } = e.target;
        const drugDIN = item["DIN"];
        const drugName = item["Drug Name"];
        
        if (checked) {
            //selected box gets added
            setSelectedDrugs(prev => [...prev, {DIN: drugDIN, name: drugName}]);
            //if its only one selected set it as new
            if (selectedDrugs.length === 0) {
                setSelectedDrug(item);
                //console.log(item); //dubugging
            }
        } 
        else {
            //when unchecking a box update the array
            setSelectedDrugs(prev => {
                const updated = prev.filter(drug => drug.DIN !== drugDIN);
                //if nothing is selected clear the array
                if (updated.length === 0) {
                    setSelectedDrug(null);

                    if (display === "editDrug") {
                        setDisplay("main");
                    }
                }
                //console.log(updated); //dubugging
                return updated;
            });
        }
    };

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
            setDataObtained(false);
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Drug/getdrugs', {
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
                setOG_Data(transformedData);
                setData(transformedData);
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
            setAlertMessage("Error getting drugs. Please try again.");
            setIsAlertModalOpen(true);
            console.error(error);
            setDataObtained(false);
        }
    }

    // Handle radio change
    // const handleRadioChange = (e, item) => {
    //     if (e.target.checked) {
    //         setSelectedDrug({ ...item, selected: true });
    //         setDisplay("main");
    //     }
    // }

    // Handle delete button click
    const handleDeleteClick = () => {
        if (selectedDrugs.length > 0) {
            
            const drugsToDelete = selectedDrugs.map(drug => ({
                din: drug.DIN,
                name: drug.name
            }));
            setSelectedDrugs(drugsToDelete);
            setIsDeleteModalOpen(true);
        }
        else {
            setAlertMessage("Please select at least one drug to delete");
            setIsAlertModalOpen(true);
        }
    }

   

    // Filter drug data on search box input
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalData = OG_data //makes sure we start searching with every search option included.
        if (SearchTerm != ""){
            let FilteredData = LocalData.filter(function(Drug){
            
                let result = expression.test(Drug[SearchBy]);
                if (result === true){
                    return true;
                }
                else{
                    return false;
                }
            })
            setData(FilteredData);
        }
<<<<<<< HEAD
    }, [search, data]);

    useEffect(() => {
    }, [selectedDrug]);

    // Update the data when the modals are closed
=======
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
>>>>>>> dev
    useEffect(() => {
        if (!isAddModalOpen && !isDeleteModalOpen) {
            // If both modals are closed, fetch the data
            GetDrugs();
        }
<<<<<<< HEAD
    }, [isAddModalOpen, isDeleteModalOpen, display]);
=======
    }, [isAddModalOpen, isDeleteModalOpen]);
>>>>>>> dev

    const ChangeDisplay = (e) => {
        let select = e.target.id;

        if (select === "bulkDrug") {
            setDisplay("bulkDrug");
        }

        if (select === "editDrug") {
            
            if (selectedDrugs.length === 1) {
                const currentSelectedDrug = Data.find(drug => drug["DIN"] === selectedDrugs[0].DIN);

                setSelectedDrug(currentSelectedDrug);
                setDisplay("editDrug");
            }
            else {
                setAlertMessage("Please select only one drug to delete");
                setIsAlertModalOpen(true);
            }
        }
    }

    useEffect(() => {
        switch (display) {
            case "main":
                setContent(null);
                break;
            case "bulkDrug":
                setContent(<BulkDrugs setDisplay={setDisplay} getDrugs={GetDrugs}/>);
                break;
            case "editDrug":
                setContent(<EditDrug key={selectedDrugs["DIN"]} setDisplay={setDisplay} setSelectedDrug={setSelectedDrug} selectedDrug={selectedDrug } getDrugs={GetDrugs} />)
                break;
        }
    }, [display, setContent]);
    return(

        <div>
            <div className='page-header-name'>Drugs List</div>
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
                        <Dropdown.Item id="DIN" onClick={(e)=>{setSearchBy(e.target.id)}}>DIN</Dropdown.Item>
                        <Dropdown.Item id="Drug Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Drug Name</Dropdown.Item>
                        <Dropdown.Item id="Dosage" onClick={(e)=>{setSearchBy(e.target.id)}}>Dosage</Dropdown.Item>
                        <Dropdown.Item id="Strength" onClick={(e)=>{setSearchBy(e.target.id)}}>Strength</Dropdown.Item>
                        <Dropdown.Item id="Manufacturer" onClick={(e)=>{setSearchBy(e.target.id)}}>Manufacturer</Dropdown.Item>
                        <Dropdown.Item id="Concentration" onClick={(e)=>{setSearchBy(e.target.id)}}>Concentration</Dropdown.Item>
                        <Dropdown.Item id="Reference Brand" onClick={(e)=>{setSearchBy(e.target.id)}}>Reference Brand</Dropdown.Item>
                        <Dropdown.Item id="Container Size" onClick={(e)=>{setSearchBy(e.target.id)}}>Container Size</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

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
<<<<<<< HEAD
                            onClose={() => setIsDeleteModalOpen(false)} 
                            drugToDelete={selectedDrug}
=======
                            onClose={() => setIsDeleteModalOpen(false)}
                            drugToDelete={selectedDrugs}
                            setDrugToDelete={setSelectedDrugs}
>>>>>>> dev
                        />

                        <AlertModal
                            isOpen={isAlertModalOpen}
                            message={alertMessage}
                            onClose={() => setIsAlertModalOpen(false)}
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
<<<<<<< HEAD
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
=======
                <div className='scroll-table'>
                    <table>
                    <thead>
                        <tr>
                            <th></th>
                            {tableHeaders.map(header => (
                                <th key={header} onClick={() => headerSort(header,true,column, setColumn,sortOrder, setOrder, Data, setData)} style={{ cursor: 'pointer' }}>
                                    {header} {column === header ? (sortOrder === 'asc' ? '▲' : '▼') : ''}
                                </th>
                            ))}
                        </tr>
                    </thead>
                        <tbody>
                            {Data.map((item, index) => (
                                <tr key={index}>
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedDrugs.some(drug => drug.DIN === item["DIN"])}
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
                </div>
>>>>>>> dev
            )}
        </div>

    )

}

export default Drugs;