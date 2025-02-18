
//react imports
import { useState, useEffect } from "react";
import AlertModal from '@components/modals/alertModal';
//css
import "@components/modals/modalStyles.css";

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
const PhysicianLookupModal = ({ physicianIsOpen, setPhysicianIsOpen, setPhysician}) => {

    const [modalHeight, setModalHeight] = useState('auto');
    
    // UseStates for drug data
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false);
    const [dataError, setDataError] = useState(false);

    //modal alert stuff
    const [AlertModalOpen, setAlertModalOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState();
    // Map the headers to the data for the table
    const headerMapping = {
        "PhysicianID": "Physician ID",
        "FName": "First Name",
        "LName": "Last Name",
        "City": "City",
        "Province": "Province"
    };

    //state to confirm an option is selected
    const [radioChecked, setRadioChecked] = useState(false);

    // Get the drugs
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
                setAlertModalOpen(true);
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
            setAlertModalOpen(true);
            setDataObtained(false);
        }
    }

    //attempt to obtain user data until success
    useEffect(() => {

        if (!dataObtained) GetPhysicians();

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
        setPhysician(item);
        setRadioChecked(true);
    }   

    //exit no selection
    const CloseNoSelection = () =>{
        setPhysicianIsOpen(false);
    }

    //exit with selection 
    const CloseWithSelection = () =>{
        setRadioChecked(false);
        setPhysicianIsOpen(false);
    }

    return(

        physicianIsOpen && (
            <div>
                <AlertModal
                    isOpen={AlertModalOpen}
                    message={AlertMessage}
                    onClose={function(){
                        setAlertModalOpen(false);
                    }}
                ></AlertModal>
                <div className={`modal ${physicianIsOpen ? 'isOpen' : ''}`} style={{ display: physicianIsOpen ? 'flex' : 'none' }}>
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
            </div>
            
        )    
        
    )

}

export default PhysicianLookupModal;