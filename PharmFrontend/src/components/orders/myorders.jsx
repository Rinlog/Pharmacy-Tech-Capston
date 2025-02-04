//react imports
import {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

//modal imports
import DrugLookupModal from '@components/modals/drugLookupModal.jsx';
import PatientLookupModal from '@components/modals/patientLookupModal.jsx';
import PhysicianLookupModal from '@components/modals/physicianLookupModal.jsx';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
function MyOrders(){
    // UseStates for data
    const [data, setData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false);
    const [dataError, setDataError] = useState(false);

    // Check the cookies
    const [cookies] = useCookies(['user', 'admin']);

    // Extract user and admin cookies
    const { user, admin } = cookies;

    //usestates for amending
    const [order, setOrder] = useState(null);
    const [openAmend, setOpenAmend] = useState(false);

    //modal stuff
    const [drug, setDrug] = useState(null);
    const [patient, setPatient] = useState(null);
    const [physician, setPhysician] = useState(null);
    
    const [drugIsOpen, setDrugIsOpen] = useState(false);
    const [patientIsOpen, setPatientIsOpen] = useState(false);
    const [physicianIsOpen, setPhysicianIsOpen] = useState(false);

    //form states from db
    const [formPatient, setFormPatient] = useState('');
    const [formDIN, setFormDIN] = useState('');
    const [formDbDose, setFormDbDose] = useState('');
    const [formPhysician, setFormPhysician] = useState('');

    //form states from entry
    const [rx, setRx] = useState('');
    const [route, setRoute] = useState('');
    const [formDose, setFormDose] = useState('');
    const [formForm, setFormForm] = useState('');
    const [frequency, setFrequency] = useState('');
    const [SIG, setSIG] = useState('');
    const [SIGDesc, setSIGDesc] = useState('');
    const [duration, setDuration] = useState('');
    const [quantity, setQuantity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [comments, setComments] = useState('No Comments');

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
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Order/getMyOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            });
            // Get the data out of the response
            const fetchedData = await response.json();

            // If there is an issue with the response, alert the user
            if(response.status != 200) {
                alert(fetchedData.message);
            }

            if (fetchedData.data.length > 0) {
                
                // We got data, so transform it
                const transformedData = await Promise.all(fetchedData.data.map(async item => {
                    // Call the getNames API
                    const namesResponse = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Management/getnames', {
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
                        "Patient ID": he.decode(namesData.ppr),
                        "Last Name": he.decode(namesData.patientLName),
                        "First Name": he.decode(namesData.patientFName),
                        "DIN": he.decode(namesData.din),
                        "Drug Name": he.decode(namesData.drugName),
                        "Physician ID": he.decode(namesData.physicianID),
                        "Phys Last Name": he.decode(namesData.physicianLName),
                        "Phys First Name": he.decode(namesData.physicianFName),
                        "Status": he.decode(item.status),
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

    //amend open
    const AmendOrderClick = (item) =>{

        setOrder(item);
        if (item != null){
            setOpenAmend(true);
        }

    }

    //set up form
    const SetupForm = (oldData) => {

        setDrug({
            "DIN": oldData["DIN"],
            "Drug Name": oldData["Drug Name"]
        });

        setPhysician({
            "Physician ID": oldData["Physician ID"],
            "Last Name": oldData["Phys Last Name"],
            "First Name": oldData["Phys First Name"]
        });

        setPatient({
            "Patient ID": oldData["Patient ID"],
            "First Name": oldData["First Name"],
            "Last Name": oldData["Last Name"]
        });

        setRx(oldData["Rx Number"]);
        setRoute(oldData["Route"]);
        setFormDose(oldData["Prescribed Dose"]);
        setFormForm(oldData["Form"]);
        setFrequency(oldData["Frequency"]);
        setSIG(oldData["SIG Code"]);
        setSIGDesc(oldData["SIG Description"]);
        setDuration(oldData["Duration"]);
        setQuantity(oldData["Quantity"]);
        setStartDate(oldData["Start Date"]);
        setStartTime(oldData["Start Time"]);
        setComments(oldData["Comments"]);

}

    //set up form
    useEffect(() => {

        if (order !== null && order !== undefined) SetupForm(order);

    },[order])

    //form submission
    const OnSubmit = async (e) =>{

        e.preventDefault();
        if (comments === '' || comments === null) setComments("No Comments");

        let order = {

            "RxNum": rx,
            "PPR": patient["Patient ID"],
            "DIN": drug["DIN"],
            "PhysicianID": physician["Physician ID"],
            "Initiator": user,
            "SIG": SIG,
            "SIGDescription": SIGDesc,
            "Form": formForm,
            "Route": route,
            "prescribedDose": formDose,
            "Frequency": frequency,
            "Duration": duration,
            "Quantity": quantity,
            "StartDate": startDate,
            "StartTime": startTime,
            "Comments": comments

        }

        //API call 
        try {

            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Order/editorder' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            });
            const data = await response.json();
            alert(data.message);
            location.reload();
            return;

        }
        catch (error){
            alert("Could not submit, please contact system administrator.");
        }
    }

    //when the drug is selected
    useEffect(() => {

        if (drug !== undefined && drug !== null){
            let formatted = drug["DIN"] + " - " + drug["Drug Name"];
            setFormDIN(formatted);

            if (drug["Dosage"] !== undefined && drug["Dosage"] !== null){
                formatted = "EX: (" + drug["Dosage"] + ")";
                setFormDbDose(formatted);
            }
        }

    },[drug]);

    //when the patient is selected
    useEffect(() => {

        if (patient !== undefined && patient !== null){
            let formatted = patient["Patient ID"] + " - " + patient["Last Name"] + ", " + patient["First Name"];
            setFormPatient(formatted);
        }

    },[patient]);

    //when the physician is selected
    useEffect(() => {

        if (physician !== undefined && physician !== null){
            let formatted = physician["Physician ID"] + " - " + physician["Last Name"] + ", " + physician["First Name"];
            setFormPhysician(formatted);
        }

    },[physician]);

    return(

        <div>
            
            {/* Displays when data has not been obtained */}
            {!dataObtained && (
                        <label>{dataError ? "Error fetching data" : "Fetching Data..."}</label>
            )}

            {/* Displays when order is selected for amending */}
            {openAmend && (

                <form className="form" id="addorder" onSubmit={OnSubmit}>

                <label htmlFor="orderPatient">Patient:</label>
                <input className="text-input" readOnly={true} value={formPatient}></input>

                <button type="button" className="button" onClick={() => setPatientIsOpen(true)}>Patient</button>

                {patientIsOpen && (
                <PatientLookupModal
                    patientIsOpen={patientIsOpen}
                    setPatientIsOpen={setPatientIsOpen}
                    setPatient={setPatient}
                />
                )}

                <br></br>

                <label htmlFor="orderDrug">Medication:</label>
                <input className="text-input" id="orderDrug" required={true} readOnly={true} value={formDIN}></input> 

                <label htmlFor="orderDose">Dose:</label>
                <input className="text-input" id="orderDose" required={true} defaultValue={formDose} onChange={(e) => setFormDose(e.target.value)}></input>
                <label>{formDbDose}</label>
                
                <button type="button" className="button" id="drugBtn" onClick={() => setDrugIsOpen(true)}>Drugs</button>


                {drugIsOpen && (
                <DrugLookupModal
                    drugIsOpen={drugIsOpen}
                    setDrugIsOpen={setDrugIsOpen}
                    setDrug={setDrug}
                />
                )}

                <br></br>

                <label htmlFor="orderForm">Form:</label>
                <input className="text-input" id="orderForm" required={true} defaultValue={formForm} onChange={(e) => setFormForm(e.target.value)}></input> <br></br>

                <label htmlFor="orderRoute">Route:</label>
                <input className="text-input" id="orderRoute" required={true} defaultValue={route} onChange={(e) => setRoute(e.target.value)}></input> <br></br>

                <label htmlFor="orderFrequency">Frequency:</label>
                <input className="text-input" id="orderFrequency" required={true} defaultValue={frequency} onChange={(e) => setFrequency(e.target.value)}></input> <br></br>

                <label htmlFor="orderDuration">Duration:</label>
                <input className="text-input" id="orderDuration" required={true} defaultValue={duration} onChange={(e) => setDuration(e.target.value)}></input> <br></br>

                <label htmlFor="orderQuantity">Quantity:</label>
                <input className="text-input" id="orderQuantity" required={true} defaultValue={quantity} onChange={(e) => setQuantity(e.target.value)}></input>

                <br></br>

                <label htmlFor="orderPhysician">Physician:</label>
                <input className="text-input" id="orderPhysician" required={true} readOnly={true} value={formPhysician} onChange={setFormPhysician}></input>

                <button type="button" className="button" onClick={() => setPhysicianIsOpen(true)}>Physician</button>

                {physicianIsOpen && (
                <PhysicianLookupModal
                    physicianIsOpen={physicianIsOpen}
                    setPhysicianIsOpen={setPhysicianIsOpen}
                    setPhysician={setPhysician}
                />
                )}

                <br></br>

                <label htmlFor="orderSIG">SIG:</label>
                <input type="text" id="orderSIG" className="text-input" required={true} defaultValue={SIG} onChange={(e) => setSIG(e.target.value)}></input> <br></br>

                <label htmlFor="orderStart">SIG Description:</label>
                <input type="text" id="orderStart" className="text-input" required={true} defaultValue={SIGDesc} onChange={(e) => setSIGDesc(e.target.value)}></input> <br></br>

                <label htmlFor="orderStart">Start Date:</label>
                <input type="date" id="orderStart" className="date-input" required={true} defaultValue={startDate} onChange={(e) => setStartDate(e.target.value)}></input> <br></br>

                <label htmlFor="orderTime">Start Time:</label>
                <input id="orderTime" className="text-input" required={true} defaultValue={startTime} onChange={(e) => setStartTime(e.target.value)}></input>
                <label>XX:XX Format</label> <br></br>

                <label htmlFor="orderComments">Comments:</label>
                <input type="text" id="orderComments" className="text-input" required={true} defaultValue={comments} onChange={(e) => setComments(e.target.value)}></input> <br></br>

                <button type="submit" className="button" required={true} onClick={OnSubmit}>Submit</button>

            </form>

            )}

            {/* Displays when data has been obtained */}
            {dataObtained && (
                        <>
                        <h2>Rejected</h2>                        
                        <div className='scroll-table'>
                            <table>
                                <thead>
                                    <tr>
                                        {/* Empty column for amend buttons */}
                                        <th></th>
                                        {tableHeaders.map(header => (
                                            <th key={header}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                        {data
                                        .filter(item => item["Status"] === "Rejected") // Filter data where status is "Rejected"
                                        .map((item, index) => (
                                            <tr key={index}>

                                            {/* Add amend button for rejected */}
                                            <td>
                                            <button className="button" type="button" onClick={() => AmendOrderClick(item)}>Amend</button>
                                            </td>

                                            {tableHeaders.map(header => (
                                                <td key={header}>{item[header]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table> 
                        </div>

                        <h2>Approved</h2>                        
                        <div className='scroll-table'>
                            <table>
                                <thead>
                                    <tr>
                                        {tableHeaders.map(header => (
                                            <th key={header}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                        {data
                                        .filter(item => item["Status"] === "Approved") // Filter data where status is "Rejected"
                                        .map((item, index) => (
                                            <tr key={index}>

                                            {tableHeaders.map(header => (
                                                <td key={header}>{item[header]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table> 
                        </div>

                        <h2>Other</h2>      
                        <div className='scroll-table'>
                            <table>
                                <thead>
                                    <tr>
                                        {tableHeaders.map(header => (
                                            <th key={header}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                        {data
                                        .filter(item => item["Status"] !== "Approved" && item["Status"] !== "Rejected")
                                        .map((item, index) => (
                                            <tr key={index}>

                                            {tableHeaders.map(header => (
                                                <td key={header}>{item[header]}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table> 
                        </div>
                        </>
                    )
                }

        </div>

    )

}

export default MyOrders;