// React import
import React, { useState, useEffect } from 'react';

// Import modals
import VerifyOrder from './verifyOrder';
import SortByHeader from '@components/headerSort/sortByHeader';

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function Verification() {

    // UseStates for order data
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false);
    const [dataError, setDataError] = useState(false);

    //table sorting
    const [column, setColumn] = useState(null);
    const [sortOrder, setOrder] = useState('desc');

    const [display, setDisplay] = useState("main");
    const [content, setContent] = useState(null);

    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    const [selectedOrder, setSelectedOrder] = useState({ "Rx Number": null, selected: false });

    // Map the headers to the data for the table
    const headerMapping = {
        "rxNum": "Rx Number",
        "patientName": "Patient Name",
        "drugName": "Drug Name",
        "physicianName": "Physician Name",
        "initiator": "Initiator",
        "dateSubmitted": "Date Submitted",
        "sig": "SIG Code",
        "sigDescription": "SIG Description",
        "form": "Form",
        "route": "Route",
        "prescribedDose": "Prescribed Dose",
        "frequency": "Frequency",
        "duration": "Duration",
        "quantity": "Quantity",
        "startDate": "Start Date",
        "startTime": "Start Time",
        "comments": "Comments"

    };

    // Get the orders
    const GetOrders = async () => {
        try {
            setDataObtained(false); //very important line, this forces react to re-render the orders by changing the visibility of them.
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Order/getorders', {
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
                isAlertModalOpen(true);
            }

            // Filter for only orders that are not verified (submitted or amended)
            fetchedData.data = fetchedData.data.filter(item => item.status === "Submitted" || item.status === "Amended");

            // Filter out orders created by the current user
            fetchedData.data = fetchedData.data.filter(item => item.initiator !== document.cookie.split('; ').find(row => row.startsWith('user=')).split('=')[1]);

            if (fetchedData.data.length > 0) {
                
                // We got data, so transform it
                const transformedData = await Promise.all(fetchedData.data.map(async item => {
                    // Call the getNames API
                    const namesResponse = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Management/getnames', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Key-Auth':ApiAccess
                        },
                        body: JSON.stringify({
                            userID: item.initiator,
                            ppr: item.ppr,
                            physicianID: item.physicianID,
                            din: item.din,
                            // We also need to pass through empty strings for the other fields since the API expects them
                            patientFName: '',
                            patientLName: '',
                            drugName: '',
                            physicianFName: '',
                            physicianLName: '',
                            userFName: '',
                            userLName: '',
                        }),
                    });
                    const namesData = await namesResponse.json();

                    // Make sure start date does not include time (YYYY-MM-DD HH:MM:SS -> YYYY-MM-DD)
                    item.startDate = item.startDate.split(' ')[0];


                    return {
                        "Rx Number": he.decode(item.rxNum),
                        "Patient Name": he.decode(namesData.patientFName + ' ' + namesData.patientLName),
                        "Drug Name": he.decode(namesData.drugName),
                        "Physician Name": he.decode(namesData.physicianFName + ' ' + namesData.physicianLName),
                        "Status": he.decode(item.status),
                        "Initiator": he.decode(namesData.userFName + ' ' + namesData.userLName),
                        "Date Submitted": he.decode(item.dateSubmitted),
                        "SIG Code": he.decode(item.sig),
                        "SIG Description": he.decode(item.sigDescription),
                        "Form": he.decode(item.form),
                        "Route": he.decode(item.route),
                        "Prescribed Dose": he.decode(item.prescribedDose),
                        "Frequency": he.decode(item.frequency),
                        "Duration": he.decode(item.duration),
                        "Quantity": he.decode(item.quantity),
                        "Start Date": he.decode(item.startDate),
                        "Start Time": he.decode(item.startTime),
                        "Comments": he.decode(item.comments)
                    };
                }));

                setData(transformedData);
                const keys = Object.keys(transformedData[0]);

                // Map the custom versions
                const customHeaders = keys.map(key => headerMapping[key] || key);
                setTableHeaders(customHeaders);
                setDataObtained(true);
                setDataError(false);

            }
        } catch (error) {
            setAlertMessage("Error getting orders. Please try again.");
            isAlertModalOpen(true);
            console.error(error);
            setDataObtained(false);
        }
    }

    // Handle radio change
    const handleRadioChange = (e, item) => {
        if (e.target.checked) {
            setSelectedOrder({ ...item, selected: true });
        }
    }

    // Wait for the selected order to change
    useEffect(() => {
        if(selectedOrder.selected){
            //this allows the verify order section to re-render each time a dif radio button is pressed
            setDisplay("main");
            setTimeout(function(){
                setDisplay("verifyOrder");
            },100);
        }
    }, [selectedOrder]);

    // Get the orders initially on page load
    useEffect(() => {
        GetOrders();
    }, []);


    // Filter order data on search box input
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
        switch (display) {
            case "main":
                setContent(null);
                break;
            case "verifyOrder":
                setContent(<VerifyOrder setDisplay={setDisplay} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} GetOrders={GetOrders}/>);
                break;
        }
    }, [display]); //remove setContent

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
    
    return(

        <div>
            <div className='page-header-name'>Verify Orders</div>
            <hr/>

            <input type="text" id="orderSearch" placeholder="Search Orders" value={search} onChange={e => setSearch(e.target.value)}/>
            <br/><br/>

            <i>&nbsp;&nbsp;*To verify an order, select it then fill out the verification form.</i>
            {content}
            
            {/* Displays when data has not been obtained */}
            {!dataObtained && (
                <div>
                <br/>
                <label>{dataError ? "No orders found" : "Fetching Data..."}</label>
                </div>
            )}

            {/* Displays when data has been obtained */}
            {dataObtained && (
                <div className="scroll-table">
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
                                            checked={selectedOrder.selected && item["Rx Number"] === selectedOrder["Rx Number"]}
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

export default Verification;