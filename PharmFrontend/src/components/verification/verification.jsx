// React import
import React, { useState, useEffect } from 'react';


import VerifyOrder from './verifyOrder';

import headerSort from '@components/headerSort/HeaderSort';

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';
import Dropdown from 'react-bootstrap/Dropdown';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess

function Verification() {

    // UseStates for order data
    const [SearchBy, setSearchBy] = useState("Patient Name");
    const [OG_data, setOG_Data] = useState([]);
    const [Data, setData] = useState([]);

    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false); //set it to false to reload the page (ONLY FOR THIS PAGE)
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
            setDataObtained(false);
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
                setOG_Data(transformedData);
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
    //used for when page first loads
    useEffect( function(){
        const Interval = setInterval(function(){
            if (dataObtained == false){
                GetOrders();
            }
            else{
                clearInterval(Interval);
            }
        },200)
        return (
            function(){
                clearInterval(Interval);
            }
        )
    },[dataObtained])

    // Wait for the selected order to change
    useEffect(() => {
        if(selectedOrder.selected){
            //this allows the verify order section to re-render each time a dif radio button is pressed
            setDisplay("main");
            setTimeout(function(){
                setDisplay("verifyOrder");
            },10);
        }
    }, [selectedOrder]);

    // Filter order data on search box input
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalData = OG_data //makes sure we start searching with every search option included.
        if (SearchTerm != ""){
            let FilteredData = LocalData.filter(function(Order){
            
                let result = expression.test(Order[SearchBy]);
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

    return(

        <div>
            <div className='page-header-name'>Verify Orders</div>
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
                        <Dropdown.Item id="Rx Number" onClick={(e)=>{setSearchBy(e.target.id)}}>Rx Number</Dropdown.Item>
                        <Dropdown.Item id="Patient Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Patient Name</Dropdown.Item>
                        <Dropdown.Item id="Drug Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Drug Name</Dropdown.Item>
                        <Dropdown.Item id="Physician Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Physician Name</Dropdown.Item>
                        <Dropdown.Item id="Status" onClick={(e)=>{setSearchBy(e.target.id)}}>Status</Dropdown.Item>
                        <Dropdown.Item id="Initiator" onClick={(e)=>{setSearchBy(e.target.id)}}>Initiator</Dropdown.Item>
                        <Dropdown.Item id="Date Submitted" onClick={(e)=>{setSearchBy(e.target.id)}}>Date Submitted</Dropdown.Item>
                        <Dropdown.Item id="SIG Code" onClick={(e)=>{setSearchBy(e.target.id)}}>SIG Code</Dropdown.Item>
                        <Dropdown.Item id="SIG Description" onClick={(e)=>{setSearchBy(e.target.id)}}>SIG Description</Dropdown.Item>
                        <Dropdown.Item id="Form" onClick={(e)=>{setSearchBy(e.target.id)}}>Form</Dropdown.Item>
                        <Dropdown.Item id="Route" onClick={(e)=>{setSearchBy(e.target.id)}}>Route</Dropdown.Item>
                        <Dropdown.Item id="Prescribed Dose" onClick={(e)=>{setSearchBy(e.target.id)}}>Prescribed Dose</Dropdown.Item>
                        <Dropdown.Item id="Frequency" onClick={(e)=>{setSearchBy(e.target.id)}}>Frequency</Dropdown.Item>
                        <Dropdown.Item id="Duration" onClick={(e)=>{setSearchBy(e.target.id)}}>Duration</Dropdown.Item>
                        <Dropdown.Item id="Quantity" onClick={(e)=>{setSearchBy(e.target.id)}}>Quantity</Dropdown.Item>
                        <Dropdown.Item id="Start Date" onClick={(e)=>{setSearchBy(e.target.id)}}>Start Date</Dropdown.Item>
                        <Dropdown.Item id="Start Time" onClick={(e)=>{setSearchBy(e.target.id)}}>Start Time</Dropdown.Item>
                        <Dropdown.Item id="Comments" onClick={(e)=>{setSearchBy(e.target.id)}}>Comments</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

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