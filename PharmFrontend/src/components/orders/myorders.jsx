//react imports
import {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';
import $, { grep } from 'jquery';
import Dropdown from "react-bootstrap/Dropdown";

import AlertModal from '@components/modals/alertModal';
// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

//modal imports
import DrugLookupModal from '@components/modals/drugLookupModal.jsx';
import PatientLookupModal from '@components/modals/patientLookupModal.jsx';
import PhysicianLookupModal from '@components/modals/physicianLookupModal.jsx';
import SIGLookupModal from "@components/modals/SIGLookupModal";

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function MyOrders(){

    //search stuff
    const [SearchBy, setSearchBy] = useState("First Name");
    // UseStates for data
    const [data, setData] = useState([]);
    const [OG_Data, setOG_Data] = useState([]);

    const [tableHeaders, setTableHeaders] = useState([]);
    const [dataObtained, setDataObtained] = useState(false);
    const [dataError, setDataError] = useState(false);

    //modal alert stuff
    const [AlertModalOpen, setAlertModalOpen] = useState(false);
    const [AlertMessage, setAlertMessage] = useState();

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

    const [SIGIsOpen, setSIGIsOpen] = useState(false);
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

    //search related stuff
    function Search(SearchTerm){
        let expression = RegExp("^"+SearchTerm+".*$","i");
        let LocalData = OG_Data //makes sure we start searching with every search option included.
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
            setData(OG_Data);
        }
    }
    //handles the show and hide buttons
    function HandleHideShowPress(e){
        let TriggerHideVal = $(e.currentTarget).attr("triggerhide")
        let TableAffecting = $(e.currentTarget).attr("table")

        if (TriggerHideVal == "true"){
            $("#"+TableAffecting).addClass("hide");
            $("#"+TableAffecting + "Hide").addClass("hide"); //this would be the un-crossed out eye, it hides the orders when clicked
            $("#"+TableAffecting + "Show").removeClass("hide"); //this would be the crossed out eye, it shows the orders when clicked
        }
        else{
            $("#"+TableAffecting).removeClass("hide");
            $("#"+TableAffecting + "Show").addClass("hide");
            $("#"+TableAffecting + "Hide").removeClass("hide");
        }
    }
    const GetOrders = async () => {
        try {
            // Call the API
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Order/getMyOrders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(user)
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
                setOG_Data(transformedData)
                const keys = Object.keys(transformedData[0]);

                // Map the custom versions
                const customHeaders = keys.map(key => headerMapping[key] || key);
                setTableHeaders(customHeaders);
                setDataObtained(true);
                setDataError(false);

            }
        } catch (error) {
            setAlertMessage("Error getting orders. Please try again.")
            setAlertModalOpen(true);
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
            "din": oldData["DIN"],
            "name": oldData["Drug Name"],
            "dosage": oldData["Prescribed Dose"]
        });

        setPhysician({
            "physicianID": oldData["Physician ID"],
            "lName": oldData["Phys Last Name"],
            "fName": oldData["Phys First Name"]
        });

        setPatient({
            "ppr": oldData["Patient ID"],
            "fName": oldData["First Name"],
            "lName": oldData["Last Name"]
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

    function validate(){
        //these if statements are so that html5 will activate if one of the fields are blank and also for custom errors
        if (formPatient === ''){
            setAlertMessage("Patient is required");
            setAlertModalOpen(true);
            return false;
        }
        if (formDIN === ''){
            setAlertMessage("Medication is required");
            setAlertModalOpen(true);
            return false;
        }
        if (formDose === ''){return false;}
        if (formForm=== ''){return false;}
        if (route === ''){return false;}
        if (frequency === ''){return false;}
        if (duration === ''){return false;}
        if (quantity === ''){return false;}
        if (formPhysician === ''){
            setAlertMessage("Physician is required");
            setAlertModalOpen(true);
            return false;
        }
        if (SIG === ''){
            setAlertMessage("SIG code is required");
            setAlertModalOpen(true);
            return false;
        }
        if (startDate === ''){return false;}
        if (startTime === ''){return false;}
    }
    //form submission
    const OnSubmit = async (e) =>{

        if (validate == false){return;}
        e.preventDefault();
        if (comments === '' || comments === null) setComments("No Comments");

        let order = {

            "RxNum": rx,
            "PPR": patient["ppr"],
            "DIN": drug["din"],
            "PhysicianID": physician["physicianID"],
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
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(order)
            });
            const data = await response.json();
            setAlertMessage(data.message);
            setAlertModalOpen(true);
            return;

        }
        catch (error){
            setAlertMessage("Could not submit, please contact system administrator.")
            setAlertModalOpen(true);
        }
    }

    //sorting useeffect. this is easier than doing a full reright of code for the jsx loading
    useEffect(() => {
        //using jquery
        //attaching this to the header called "sroll-table" in the page content section below
        $(".scroll-table table thead th").off("click").on("click", function() {

            //header the table belongs to
            var table = $(this).closest("table");
            //getting the element from the table
            var tbody = table.find("tbody");

            //getting all the rows and putting them in an array
            var rows = tbody.find("tr").toArray();
            //index of the header clicked
            var index = $(this).index();

            //sort and toggle the order. checking to see if it has asc, if this does switch to desc
            var asc = !$(this).hasClass("asc");

            //need to make sure to remove the header class to put in a new one
            table.find("th").removeClass("asc desc");
            //depending on the 
            $(this).toggleClass("asc", asc);
            $(this).toggleClass("desc", !asc);

            //this will sort the tables now
            rows.sort((a, b) => {

                var UP = $(a).children("td").eq(index).text().toUpperCase();
                var DOWN = $(b).children("td").eq(index).text().toUpperCase();

                //took some logic from sortbyheader page
                if (UP < DOWN) {
                    return asc ? -1 : 1;
                }
                if (UP > DOWN) {
                    return asc ? 1 : -1;
                }
                return 0;
            });

            //place the new rows back into the table (append them)
            $.each(rows, (i, row) => {
                tbody.append(row);
            });
        });
      }, [dataObtained]);
      

    //when the drug is selected
    useEffect(() => {
        if (drug !== undefined && drug !== null){
            let formatted = drug["din"] + " - " + drug["name"];
            setFormDIN(formatted);
            formatted = "EX: (" + drug["dosage"] + ")";
            setFormDbDose(formatted);
        }

    },[drug]);

    //when the patient is selected
    useEffect(() => {

        if (patient !== undefined && patient !== null){
            let formatted = patient["ppr"] + " - " + patient["lName"] + ", " + patient["fName"];
            setFormPatient(formatted);
        }

    },[patient]);

    //when the physician is selected
    useEffect(() => {
        if (physician !== undefined && physician !== null){
            let formatted = physician["physicianID"] + " - " + physician["lName"] + ", " + physician["fName"];
            setFormPhysician(formatted);
        }

    },[physician]);

    return(

        <div>
            <AlertModal
                    isOpen={AlertModalOpen}
                    message={AlertMessage}
                    onClose={function(){
                        setAlertModalOpen(false);
                        if (AlertMessage == "Order successfuly amended."){
                            location.reload();
                        }
                    }}
            ></AlertModal>
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

                <PatientLookupModal
                    visible={patientIsOpen}
                    setVisible={setPatientIsOpen}
                    setPatient={setPatient}
                />  

                <label htmlFor="orderDrug">Medication:</label>
                <input className="text-input" id="orderDrug" required={true} readOnly={true} value={formDIN}></input> 

                <label htmlFor="orderDose">Dose:</label>
                <input className="text-input" id="orderDose" required={true} defaultValue={formDose} onChange={(e) => setFormDose(e.target.value)}></input>
                <label>{formDbDose}</label>
                
                <button type="button" className="button" id="drugBtn" onClick={() => setDrugIsOpen(true)}>Drugs</button>


                <DrugLookupModal
                    visible={drugIsOpen}
                    setVisible={setDrugIsOpen}
                    setDrug={setDrug}
                />

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

                <PhysicianLookupModal
                    visible={physicianIsOpen}
                    setVisible={setPhysicianIsOpen}
                    setPhysician={setPhysician}
                />

                <label htmlFor="orderSIG">SIG:</label>
                <input type="text" id="orderSIG" className="text-input" required={true} defaultValue={SIG} readOnly={true}></input>

                <button type="button" className='button' onClick={function(e){setSIGIsOpen(true)}}>SIG Code</button><br></br>
                
                <SIGLookupModal
                    visible={SIGIsOpen}
                    setVisible={setSIGIsOpen}
                    setSig={setSIG}
                    setSigDesc={setSIGDesc}
                />
                <label htmlFor="orderStart">SIG Description:</label>
                <input type="text" id="orderStart" className="text-input" required={true} defaultValue={SIGDesc} readOnly={true}></input> <br></br>

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
                            <div className='d-flex align-items-center'>
                                <div>
                                    <input type="text" id="drugSearch" placeholder={"Search by "+SearchBy} onChange={e => Search(e.target.value)}/>
                                </div>
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
                                        <Dropdown.Item id="Patient ID" onClick={(e)=>{setSearchBy(e.target.id)}}>Patient ID</Dropdown.Item>
                                        <Dropdown.Item id="Last Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Last Name</Dropdown.Item>
                                        <Dropdown.Item id="First Name" onClick={(e)=>{setSearchBy(e.target.id)}}>First Name</Dropdown.Item>
                                        <Dropdown.Item id="DIN" onClick={(e)=>{setSearchBy(e.target.id)}}>DIN</Dropdown.Item>
                                        <Dropdown.Item id="Physician ID" onClick={(e)=>{setSearchBy(e.target.id)}}>Physician ID</Dropdown.Item>
                                        <Dropdown.Item id="Phys Last Name" onClick={(e)=>{setSearchBy(e.target.id)}}>Phys Last Name</Dropdown.Item>
                                        <Dropdown.Item id="Status" onClick={(e)=>{setSearchBy(e.target.id)}}>Status</Dropdown.Item>
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
                        <div className="d-flex align-items-center">
                            <h2>Rejected</h2>
                            <div className="hide" id="RejectedShow">
                                <button className="HideButtonCSS" triggerhide="false" table="Rejected" onClick={HandleHideShowPress}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M4.51848 5.55639L6.82251 7.86611C5.6051 8.85592 4.65508 10.1872 4.09704 11.7195L4 11.9859L4.10384 12.2498C4.69454 13.7507 5.68174 15.1297 6.90031 16.1241C8.31938 17.2822 10.1044 17.9758 12.0449 17.9758C13.4414 17.9758 14.7584 17.6164 15.9164 16.9824L18.4277 19.5L19.4815 18.4436L17.1775 16.1339L16.1167 15.0705L9.19255 8.12922L8.08361 7.01755L5.57226 4.5L4.51848 5.55639ZM7.88326 8.92948C6.89207 9.69943 6.09644 10.7454 5.59957 11.9656C6.10925 13.1365 6.90095 14.1982 7.84116 14.9655C9.01025 15.9196 10.467 16.4819 12.0449 16.4819C13.0265 16.4819 13.9605 16.2644 14.8075 15.8708L13.875 14.9361C13.3341 15.2838 12.6902 15.4859 12 15.4859C10.0795 15.4859 8.52268 13.9252 8.52268 12C8.52268 11.3081 8.72429 10.6626 9.07117 10.1203L7.88326 8.92948ZM10.1701 11.2219C10.0688 11.4609 10.013 11.7237 10.013 12C10.013 13.1001 10.9026 13.9919 12 13.9919C12.2756 13.9919 12.5378 13.936 12.7762 13.8345L10.1701 11.2219Z" fill="#1F2328"/>
                                        <path d="M11.9551 6.02417C11.2163 6.02417 10.4988 6.1248 9.81472 6.31407C9.69604 6.3469 9.57842 6.38239 9.4619 6.42047L10.6812 7.64274C11.0937 7.56094 11.5195 7.51813 11.9551 7.51813C13.533 7.51813 14.9898 8.08041 16.1588 9.03448C17.099 9.80176 17.8907 10.8635 18.4004 12.0344C18.0874 12.803 17.6557 13.503 17.1308 14.1083L18.1868 15.1669C18.9236 14.3372 19.5102 13.359 19.903 12.2805L20 12.0141L19.8962 11.7502C19.3055 10.2493 18.3183 8.87033 17.0997 7.87589C15.6806 6.71782 13.8956 6.02417 11.9551 6.02417Z" fill="#1F2328"/>
                                    </svg>
                                </button>
                            </div>
                            <div id="RejectedHide">
                                <button className="HideButtonCSS" triggerhide="true" table="Rejected" onClick={HandleHideShowPress}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.55774 11.9654C6.07076 13.1411 6.86762 14.2071 7.81397 14.9775C8.99068 15.9354 10.4569 16.5 12.0451 16.5C14.8882 16.5 17.3619 14.6817 18.4421 12.0346C17.9291 10.8589 17.1323 9.79288 16.1859 9.02249C15.0092 8.06456 13.5429 7.5 11.9548 7.5C9.11169 7.5 6.63795 9.31828 5.55774 11.9654ZM4.04543 11.7183C5.25854 8.39553 8.32501 6 11.9548 6C13.9079 6 15.7046 6.69645 17.1329 7.85921C18.3594 8.85768 19.3531 10.2422 19.9476 11.7492L20.0521 12.0141L19.9545 12.2817C18.7413 15.6045 15.6749 18 12.0451 18C10.092 18 8.29531 17.3035 6.86698 16.1408C5.64047 15.1423 4.64682 13.7578 4.05228 12.2508L3.94775 11.9859L4.04543 11.7183ZM11.9999 10.5C11.1715 10.5 10.4999 11.1716 10.4999 12C10.4999 12.8284 11.1715 13.5 11.9999 13.5C12.8284 13.5 13.4999 12.8284 13.4999 12C13.4999 11.1716 12.8284 10.5 11.9999 10.5ZM8.99994 12C8.99994 10.3431 10.3431 9 11.9999 9C13.6568 9 14.9999 10.3431 14.9999 12C14.9999 13.6569 13.6568 15 11.9999 15C10.3431 15 8.99994 13.6569 8.99994 12Z" fill="#1F2328"/>
                                    </svg>
                                </button>
                            </div>
                        </div>                      
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
                                <tbody id="Rejected">
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

                        <div className="d-flex align-items-center">
                            <h2>Approved</h2>
                                <div className="hide" id="ApprovedShow">
                                    <button className="HideButtonCSS" triggerhide="false" table="Approved" onClick={HandleHideShowPress}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M4.51848 5.55639L6.82251 7.86611C5.6051 8.85592 4.65508 10.1872 4.09704 11.7195L4 11.9859L4.10384 12.2498C4.69454 13.7507 5.68174 15.1297 6.90031 16.1241C8.31938 17.2822 10.1044 17.9758 12.0449 17.9758C13.4414 17.9758 14.7584 17.6164 15.9164 16.9824L18.4277 19.5L19.4815 18.4436L17.1775 16.1339L16.1167 15.0705L9.19255 8.12922L8.08361 7.01755L5.57226 4.5L4.51848 5.55639ZM7.88326 8.92948C6.89207 9.69943 6.09644 10.7454 5.59957 11.9656C6.10925 13.1365 6.90095 14.1982 7.84116 14.9655C9.01025 15.9196 10.467 16.4819 12.0449 16.4819C13.0265 16.4819 13.9605 16.2644 14.8075 15.8708L13.875 14.9361C13.3341 15.2838 12.6902 15.4859 12 15.4859C10.0795 15.4859 8.52268 13.9252 8.52268 12C8.52268 11.3081 8.72429 10.6626 9.07117 10.1203L7.88326 8.92948ZM10.1701 11.2219C10.0688 11.4609 10.013 11.7237 10.013 12C10.013 13.1001 10.9026 13.9919 12 13.9919C12.2756 13.9919 12.5378 13.936 12.7762 13.8345L10.1701 11.2219Z" fill="#1F2328"/>
                                            <path d="M11.9551 6.02417C11.2163 6.02417 10.4988 6.1248 9.81472 6.31407C9.69604 6.3469 9.57842 6.38239 9.4619 6.42047L10.6812 7.64274C11.0937 7.56094 11.5195 7.51813 11.9551 7.51813C13.533 7.51813 14.9898 8.08041 16.1588 9.03448C17.099 9.80176 17.8907 10.8635 18.4004 12.0344C18.0874 12.803 17.6557 13.503 17.1308 14.1083L18.1868 15.1669C18.9236 14.3372 19.5102 13.359 19.903 12.2805L20 12.0141L19.8962 11.7502C19.3055 10.2493 18.3183 8.87033 17.0997 7.87589C15.6806 6.71782 13.8956 6.02417 11.9551 6.02417Z" fill="#1F2328"/>
                                        </svg>
                                    </button>
                                </div>
                                <div  id="ApprovedHide">
                                    <button className="HideButtonCSS" triggerhide="true" table="Approved" onClick={HandleHideShowPress}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.55774 11.9654C6.07076 13.1411 6.86762 14.2071 7.81397 14.9775C8.99068 15.9354 10.4569 16.5 12.0451 16.5C14.8882 16.5 17.3619 14.6817 18.4421 12.0346C17.9291 10.8589 17.1323 9.79288 16.1859 9.02249C15.0092 8.06456 13.5429 7.5 11.9548 7.5C9.11169 7.5 6.63795 9.31828 5.55774 11.9654ZM4.04543 11.7183C5.25854 8.39553 8.32501 6 11.9548 6C13.9079 6 15.7046 6.69645 17.1329 7.85921C18.3594 8.85768 19.3531 10.2422 19.9476 11.7492L20.0521 12.0141L19.9545 12.2817C18.7413 15.6045 15.6749 18 12.0451 18C10.092 18 8.29531 17.3035 6.86698 16.1408C5.64047 15.1423 4.64682 13.7578 4.05228 12.2508L3.94775 11.9859L4.04543 11.7183ZM11.9999 10.5C11.1715 10.5 10.4999 11.1716 10.4999 12C10.4999 12.8284 11.1715 13.5 11.9999 13.5C12.8284 13.5 13.4999 12.8284 13.4999 12C13.4999 11.1716 12.8284 10.5 11.9999 10.5ZM8.99994 12C8.99994 10.3431 10.3431 9 11.9999 9C13.6568 9 14.9999 10.3431 14.9999 12C14.9999 13.6569 13.6568 15 11.9999 15C10.3431 15 8.99994 13.6569 8.99994 12Z" fill="#1F2328"/>
                                        </svg>
                                    </button>
                                </div>
                        </div>                        
                        <div className='scroll-table'>
                            <table>
                                <thead>
                                    <tr>
                                        {tableHeaders.map(header => (
                                            <th key={header}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody id="Approved">
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

                        <div className="d-flex align-items-center">
                            <h2>Other</h2>
                                <div className="hide"  id="OtherShow">
                                    <button className="HideButtonCSS" triggerhide="false" table="Other" onClick={HandleHideShowPress}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M4.51848 5.55639L6.82251 7.86611C5.6051 8.85592 4.65508 10.1872 4.09704 11.7195L4 11.9859L4.10384 12.2498C4.69454 13.7507 5.68174 15.1297 6.90031 16.1241C8.31938 17.2822 10.1044 17.9758 12.0449 17.9758C13.4414 17.9758 14.7584 17.6164 15.9164 16.9824L18.4277 19.5L19.4815 18.4436L17.1775 16.1339L16.1167 15.0705L9.19255 8.12922L8.08361 7.01755L5.57226 4.5L4.51848 5.55639ZM7.88326 8.92948C6.89207 9.69943 6.09644 10.7454 5.59957 11.9656C6.10925 13.1365 6.90095 14.1982 7.84116 14.9655C9.01025 15.9196 10.467 16.4819 12.0449 16.4819C13.0265 16.4819 13.9605 16.2644 14.8075 15.8708L13.875 14.9361C13.3341 15.2838 12.6902 15.4859 12 15.4859C10.0795 15.4859 8.52268 13.9252 8.52268 12C8.52268 11.3081 8.72429 10.6626 9.07117 10.1203L7.88326 8.92948ZM10.1701 11.2219C10.0688 11.4609 10.013 11.7237 10.013 12C10.013 13.1001 10.9026 13.9919 12 13.9919C12.2756 13.9919 12.5378 13.936 12.7762 13.8345L10.1701 11.2219Z" fill="#1F2328"/>
                                            <path d="M11.9551 6.02417C11.2163 6.02417 10.4988 6.1248 9.81472 6.31407C9.69604 6.3469 9.57842 6.38239 9.4619 6.42047L10.6812 7.64274C11.0937 7.56094 11.5195 7.51813 11.9551 7.51813C13.533 7.51813 14.9898 8.08041 16.1588 9.03448C17.099 9.80176 17.8907 10.8635 18.4004 12.0344C18.0874 12.803 17.6557 13.503 17.1308 14.1083L18.1868 15.1669C18.9236 14.3372 19.5102 13.359 19.903 12.2805L20 12.0141L19.8962 11.7502C19.3055 10.2493 18.3183 8.87033 17.0997 7.87589C15.6806 6.71782 13.8956 6.02417 11.9551 6.02417Z" fill="#1F2328"/>
                                        </svg>
                                    </button>
                                </div>
                                <div  id="OtherHide">
                                    <button className="HideButtonCSS" triggerhide="true" table="Other" onClick={HandleHideShowPress}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 30 30" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.55774 11.9654C6.07076 13.1411 6.86762 14.2071 7.81397 14.9775C8.99068 15.9354 10.4569 16.5 12.0451 16.5C14.8882 16.5 17.3619 14.6817 18.4421 12.0346C17.9291 10.8589 17.1323 9.79288 16.1859 9.02249C15.0092 8.06456 13.5429 7.5 11.9548 7.5C9.11169 7.5 6.63795 9.31828 5.55774 11.9654ZM4.04543 11.7183C5.25854 8.39553 8.32501 6 11.9548 6C13.9079 6 15.7046 6.69645 17.1329 7.85921C18.3594 8.85768 19.3531 10.2422 19.9476 11.7492L20.0521 12.0141L19.9545 12.2817C18.7413 15.6045 15.6749 18 12.0451 18C10.092 18 8.29531 17.3035 6.86698 16.1408C5.64047 15.1423 4.64682 13.7578 4.05228 12.2508L3.94775 11.9859L4.04543 11.7183ZM11.9999 10.5C11.1715 10.5 10.4999 11.1716 10.4999 12C10.4999 12.8284 11.1715 13.5 11.9999 13.5C12.8284 13.5 13.4999 12.8284 13.4999 12C13.4999 11.1716 12.8284 10.5 11.9999 10.5ZM8.99994 12C8.99994 10.3431 10.3431 9 11.9999 9C13.6568 9 14.9999 10.3431 14.9999 12C14.9999 13.6569 13.6568 15 11.9999 15C10.3431 15 8.99994 13.6569 8.99994 12Z" fill="#1F2328"/>
                                        </svg>
                                    </button>
                                </div>
                        </div>     
                        <div className='scroll-table'>
                            <table>
                                <thead>
                                    <tr>
                                        {tableHeaders.map(header => (
                                            <th key={header}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody id="Other">
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