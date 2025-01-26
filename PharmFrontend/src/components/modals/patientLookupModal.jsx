//react imports
import {useState, useEffect} from 'react';

//css
import "@components/modals/modalStyles.css";

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

const PatientLookupModal = ({ patientIsOpen, setPatientIsOpen, setPatient}) => {

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
    )

}

export default PatientLookupModal;