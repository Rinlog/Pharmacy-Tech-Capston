//react imports
import {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

function MyOrders(){

    // UseStates for data
    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false);
    const [dataError, setDataError] = useState(false);

    // Check the cookies
    const [cookies] = useCookies(['user', 'admin']);

    // Extract user and admin cookies
    const { user, admin } = cookies;

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
            // Call the API
            const response = await fetch('https://localhost:7172/api/Order/getorders', {
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

            // Filter for only orders that are not verified (submitted or amended)
            fetchedData.data = fetchedData.data.filter(item => item.status === "Submitted" || item.status === "Amended");

            console.log(fetchedData);

            if (fetchedData.data.length > 0) {
                
                // We got data, so transform it
                const transformedData = await Promise.all(fetchedData.data.map(async item => {
                    // Call the getNames API
                    const namesResponse = await fetch('https://localhost:7172/api/Management/getnames', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
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
                        "Patient Name": namesData.patientFName + ' ' + namesData.patientLName,
                        "Drug Name": namesData.drugName,
                        "Physician Name": namesData.physicianFName + ' ' + namesData.physicianLName,
                        "Status": he.decode(item.status),
                        "Initiator": namesData.userFName + ' ' + namesData.userLName,
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
            alert("Error getting orders. Please try again.");
            console.error(error);
            setDataObtained(false);
        }
    }

    //attempt to obtain user data until success
    useEffect(() => {

        if (!dataObtained) GetOrders();

    },[dataObtained]);

    return(

        <div>This will be my orders</div>

    )

}

export default MyOrders;