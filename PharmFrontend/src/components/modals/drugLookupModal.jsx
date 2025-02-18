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
const DrugLookupModal = ({ drugIsOpen, setDrugIsOpen, setDrug}) => {

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
        "DIN": "DIN",
        "name": "Drug Name",
        "dosage": "Dosage",
        "strength": "Strength",
        "manufacturer": "Manufacturer",
        "concentration": "Concentration",
        "referenceBrand": "ReferenceBrand",
        "containerSize": "Container Size"
    };

    //state to confirm an option is selected
    const [radioChecked, setRadioChecked] = useState(false);

    // Get the drugs
    const GetDrugs = async () => {
        try {
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
                setAlertModalOpen(true);
            }


            if (fetchedData.data.length > 0) {

                
                // We got data, so transform it
                const transformedData = fetchedData.data.map(item => {
                    return {
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
            setAlertMessage("Error getting drugs. Please try again.");
            setAlertModalOpen(true);
            setDataObtained(false);
        }
    }

    //attempt to obtain user data until success
    useEffect(() => {

        if (!dataObtained) GetDrugs();

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
        setDrug(item);
        setRadioChecked(true);
    }   

    //exit no selection
    const CloseNoSelection = () =>{
        setDrugIsOpen(false);
    }

    //exit with selection 
    const CloseWithSelection = () =>{
        setRadioChecked(false);
        setDrugIsOpen(false);
    }

    return(


        drugIsOpen && (
            <div>
                <AlertModal
                    isOpen={AlertModalOpen}
                    message={AlertMessage}
                    onClose={function(){
                        setAlertModalOpen(false);
                    }}
                ></AlertModal>
                <div className={`modal ${drugIsOpen ? 'isOpen' : ''}`} style={{ display: drugIsOpen ? 'flex' : 'none' }}>
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

export default DrugLookupModal;