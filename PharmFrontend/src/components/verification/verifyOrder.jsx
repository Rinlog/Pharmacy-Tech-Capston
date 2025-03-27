//react imports
import { useState, useEffect } from 'react';

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';
import AlertModal from '../modals/alertModal';
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import PrescriptionUpload from '../orders/pictureUpload';
const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
const ApiAccess = import.meta.env.VITE_APIAccess
function VerifyOrder({setDisplay, selectedOrder, setSelectedOrder, GetOrders}) { 

    //console.log(selectedOrder);
    //states for selected order
    const [rxNum, setRxNum] = useState('');
    const [patientName, setPatientName] = useState('');
    const [drugName, setDrugName] = useState('');
    const [physicianName, setPhysicianName] = useState('');
    const [initiator, setInitiator] = useState('');
    const [SIG, setSIG] = useState('');
    const [SIGDescription, setSIGDescription] = useState('');
    const [form, setForm] = useState('');
    const [route, setRoute] = useState('');
    const [prescribedDose, setPrescribedDose] = useState('');
    const [frequency, setFrequency] = useState('');
    const [duration, setDuration] = useState('');
    const [quantity, setQuantity] = useState('');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [comments, setComments] = useState('');

    // States to keep track of the checkboxes
    const [rxNumChecked, setRxNumChecked] = useState(false);
    const [patientNameChecked, setPatientNameChecked] = useState(false);
    const [drugNameChecked, setDrugNameChecked] = useState(false);
    const [physicianNameChecked, setPhysicianNameChecked] = useState(false);
    const [initiatorChecked, setInitiatorChecked] = useState(false);
    const [SIGChecked, setSIGChecked] = useState(false);
    const [SIGDescriptionChecked, setSIGDescriptionChecked] = useState(false);
    const [formChecked, setFormChecked] = useState(false);
    const [routeChecked, setRouteChecked] = useState(false);
    const [prescribedDoseChecked, setPrescribedDoseChecked] = useState(false);
    const [frequencyChecked, setFrequencyChecked] = useState(false);
    const [durationChecked, setDurationChecked] = useState(false);
    const [quantityChecked, setQuantityChecked] = useState(false);
    const [startDateChecked, setStartDateChecked] = useState(false);
    const [startTimeChecked, setStartTimeChecked] = useState(false);
    const [commentsChecked, setCommentsChecked] = useState(false);

    const [allChecked, setAllChecked] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

    //image upload stuff
    const [savedImage, setSavedImage] = useState(null)
    const [Preloaded, setPreloaded] = useState(false) //this is used for the amend order page, if an order is pre-loaded don't add the image again when the submit the edit.
    useEffect(() => {
        if (selectedOrder) {
        // Set the data to what's in the object
        setRxNum(he.decode(selectedOrder["Rx Number"] || ''));
        setPatientName(he.decode(selectedOrder["Patient Name"] || ''));
        setDrugName(he.decode(selectedOrder["Drug Name"] || ''));
        setPhysicianName(he.decode(selectedOrder["Physician Name"] || ''));
        setInitiator(he.decode(selectedOrder["Initiator"] || ''));
        setSIG(he.decode(selectedOrder["SIG Code"] || ''));
        setSIGDescription(he.decode(selectedOrder["SIG Description"] || ''));
        setForm(he.decode(selectedOrder["Form"] || ''));
        setRoute(he.decode(selectedOrder["Route"] || ''));
        setPrescribedDose(he.decode(selectedOrder["Prescribed Dose"] || ''));
        setFrequency(he.decode(selectedOrder["Frequency"] || ''));
        setDuration(he.decode(selectedOrder["Duration"] || ''));
        setQuantity(he.decode(selectedOrder["Quantity"] || ''));
        setStartDate(he.decode(selectedOrder["Start Date"] || ''));
        setStartTime(he.decode(selectedOrder["Start Time"] || ''));
        setComments(he.decode(selectedOrder["Comments"] || ''));
        }
    }, [selectedOrder]);

    const RejectOrder = async (e) => {
        e.preventDefault();

        //create an object for the rejection with the Order number, status to change to, and the logged in user ID
        let reject = {
            RxNum: selectedOrder["Rx Number"],
            Status: "Rejected",
            UserID: document.cookie.split('; ').find(row => row.startsWith('user=')).split('=')[1],
        }

        // Pass the Rx Number to the API to reject the order
        try{
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Verify/rejectorder' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(reject)
            });

            if (response.ok) {
                setAlertMessage("Order rejected successfully");
                setIsAlertModalOpen(true);
            }
            else{
                // Alert out the message sent from the API
                const data = await response.json();
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            }
            
            
            //window.location.reload();
        }
        catch(error){
            console.error(error);
        }
    }

    const VerifyOrder = async (e) => {
        e.preventDefault();

        if (!allChecked) { //verification to make sure all checkboxes are selected. Better user experience
            setAlertMessage("To verify, select all checkboxes.");
            setIsAlertModalOpen(true);
            return;
        }

        //create an object for the verification with the Order number, status to change to, and the logged in user ID
        let verify = {
            RxNum: selectedOrder["Rx Number"],
            Status: "Verified",
            UserID: document.cookie.split('; ').find(row => row.startsWith('user=')).split('=')[1]
        }

        try{

            //api call
            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Verify/verifyorder' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Key-Auth':ApiAccess
                },
                body: JSON.stringify(verify)
            });

            if (response.ok) {
                window.location.replace("printorder/" + selectedOrder["Rx Number"]);
            }
            else{
                // Alert out the message sent from the API
                const data = await response.json();
                setAlertMessage(data.message);
                setIsAlertModalOpen(true);
            }
            
            
            //setSelectedOrder({ "Rx Number": null, selected: false });

        }
        catch(error){
            console.error(error);
        }
    }

    // Check if all checkboxes are checked
    useEffect(() => {
        // Check if all checkboxes are checked
        setAllChecked(rxNumChecked && patientNameChecked && drugNameChecked && physicianNameChecked && initiatorChecked && SIGChecked && SIGDescriptionChecked && 
        formChecked && routeChecked && prescribedDoseChecked && frequencyChecked && durationChecked && quantityChecked && startDateChecked && startTimeChecked && commentsChecked);
    }, [rxNumChecked, patientNameChecked, drugNameChecked, physicianNameChecked, initiatorChecked, SIGChecked, SIGDescriptionChecked, formChecked, routeChecked, prescribedDoseChecked, 
        frequencyChecked, durationChecked, quantityChecked, startDateChecked, startTimeChecked, commentsChecked]);

    return(

        <Container>
            {/* Displays order info */}
            <Row>
                <Col>
                    <form className="regular-form">
                        { /* Uneditable text boxes, just so the verifier (user) can check them against the prescription and checkboxes to check them off if theyre correct */}
                        <label>Rx Number</label>
                        <input type="text" value={rxNum} disabled/>
                        <input type="checkbox" id="RxNumber" onChange={(e) => setRxNumChecked(e.target.checked)}/>
                        <br></br>

                        <label>Patient</label>
                        <input type="text" value={patientName} disabled/>
                        <input type="checkbox" id="Patient" onChange={(e) => setPatientNameChecked(e.target.checked)}/>
                        <br></br>

                        <label>Drug</label>
                        <input type="text" value={drugName} disabled/>
                        <input type="checkbox" id="Drug" onChange={(e) => setDrugNameChecked(e.target.checked)}/>
                        <br></br>

                        <label>Physician</label>
                        <input type="text" value={physicianName} disabled/>
                        <input type="checkbox" id="Physician" onChange={(e) => setPhysicianNameChecked(e.target.checked)}/>
                        <br></br>

                        <label>Initiator</label>
                        <input type="text" value={initiator} disabled/>
                        <input type="checkbox" id="Initiator" onChange={(e) => setInitiatorChecked(e.target.checked)}/>
                        <br></br>

                        <label>SIG Code</label>
                        <input type="text" value={SIG} disabled/>
                        <input type="checkbox" id="SIGCode" onChange={(e) => setSIGChecked(e.target.checked)}/>
                        <br></br>

                        <label>SIG Description</label>
                        <input type="text" value={SIGDescription} disabled/>
                        <input type="checkbox" id="SIGDescription" onChange={(e) => setSIGDescriptionChecked(e.target.checked)}/>
                        <br></br>

                        <label>Form</label>
                        <input type="text" value={form} disabled/>
                        <input type="checkbox" id="Form" onChange={(e) => setFormChecked(e.target.checked)}/>
                        <br></br>

                        <label>Route</label>
                        <input type="text" value={route} disabled/>
                        <input type="checkbox" id="Route" onChange={(e) => setRouteChecked(e.target.checked)}/>
                        <br></br>

                        <label>Prescribed Dose</label>
                        <input type="text" value={prescribedDose} disabled/>
                        <input type="checkbox" id="PrescribedDose" onChange={(e) => setPrescribedDoseChecked(e.target.checked)}/>
                        <br></br>

                        <label>Frequency</label>
                        <input type="text" value={frequency} disabled/>
                        <input type="checkbox" id="Frequency" onChange={(e) => setFrequencyChecked(e.target.checked)}/>
                        <br></br>

                        <label>Duration</label>
                        <input type="text" value={duration} disabled/>
                        <input type="checkbox" id="Duration" onChange={(e) => setDurationChecked(e.target.checked)}/>
                        <br></br>

                        <label>Quantity</label>
                        <input type="text" value={quantity} disabled/>
                        <input type="checkbox" id="Quantity" onChange={(e) => setQuantityChecked(e.target.checked)}/>
                        <br></br>

                        <label>Start Date</label>
                        <input type="text" value={startDate} disabled/>
                        <input type="checkbox" id="StartDate" onChange={(e) => setStartDateChecked(e.target.checked)}/>
                        <br></br>

                        <label>Start Time</label>
                        <input type="text" value={startTime} disabled/>
                        <input type="checkbox" id="StartTime" onChange={(e) => setStartTimeChecked(e.target.checked)}/>
                        <br></br>

                        <label>Comments</label>
                        <input type="text" value={comments} disabled/>
                        <input type="checkbox" id="Comments" onChange={(e) => setCommentsChecked(e.target.checked)}/>
                        <br></br>

                        <button className="button" id="reject" onClick={RejectOrder}>Reject</button>
                        <button className="button" id="verify" onClick={VerifyOrder} >Verify</button>

                    </form>

                    <AlertModal
                        isOpen={isAlertModalOpen}
                        message={alertMessage}
                        onClose={() => {setIsAlertModalOpen(false)
                            //if not all checkboxes are selected dont refresh the page
                            if (alertMessage !== "To verify, select all checkboxes."){ 
                                setSelectedOrder({ "Rx Number": null, selected: false });
                                setDisplay("main");
                                GetOrders();
                            }
                            else {
                                setSelectedOrder({ "Rx Number": null, selected: false });
                                GetOrders();
                            }          
                        }}
                    />
                </Col>
                <Col className='mt-4'>
                        <PrescriptionUpload
                            OrderID={rxNum}
                            setSavedImage={setSavedImage}
                            savedImage={savedImage}
                            setPreloaded={setPreloaded}
                            onlyRotate={true}
                        >
                        </PrescriptionUpload>
                </Col>
            </Row>

        </Container>

    )

}

export default VerifyOrder;