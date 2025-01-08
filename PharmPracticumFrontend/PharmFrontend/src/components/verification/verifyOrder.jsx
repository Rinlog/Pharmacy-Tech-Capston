//react imports
import { useState, useEffect } from 'react';

// HTML Entities import for decoding escaped entities (e.g. &amp; -> &)
import he from 'he';

function VerifyOrder({setDisplay, selectedOrder, setSelectedOrder}) { 

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
            UserID: document.cookie.split('; ').find(row => row.startsWith('user=')).split('=')[1]
        }

        // Pass the Rx Number to the API to reject the order
        try{
            const response = await fetch('https://localhost:7172/api/Verify/rejectorder' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reject)
            });

            if (response.ok) {
                alert("Order rejected successfully");
            }
            else{
                // Alert out the message sent from the API
                const data = await response.json();
                alert(data.message);
            }
            
            setDisplay("main");
            setSelectedOrder({ "Rx Number": null, selected: false });
        }
        catch(error){
            console.error(error);
        }
    }

    const VerifyOrder = async (e) => {
        e.preventDefault();

        //create an object for the verification with the Order number, status to change to, and the logged in user ID
        let verify = {
            RxNum: selectedOrder["Rx Number"],
            Status: "Verified",
            UserID: document.cookie.split('; ').find(row => row.startsWith('user=')).split('=')[1]
        }

        console.log("verify");
        console.log(verify);

        try{

            //api call
            const response = await fetch('https://localhost:7172/api/Verify/verifyorder' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(verify)
            });

            if (response.ok) {
                alert("Order verified successfully");
            }
            else{
                // Alert out the message sent from the API
                const data = await response.json();
                alert(data.message);
            }
            
            setDisplay("main");
            setSelectedOrder({ "Rx Number": null, selected: false });

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
    }, [rxNumChecked, patientNameChecked, drugNameChecked, physicianNameChecked, initiatorChecked, SIGChecked, SIGDescriptionChecked, formChecked, routeChecked, prescribedDoseChecked, frequencyChecked, durationChecked, quantityChecked, startDateChecked, startTimeChecked, commentsChecked]);

    return(

        <div>
            {/* Displays order info */}
            <form className="regular-form">
                { /* Uneditable text boxes, just so the verifier (user) can check them against the prescription and checkboxes to check them off if theyre correct */}
                <label>Rx Number</label>
                <input type="text" value={rxNum} disabled/>
                <input type="checkbox" onChange={(e) => setRxNumChecked(e.target.checked)}/>
                <br></br>

                <label>Patient</label>
                <input type="text" value={patientName} disabled/>
                <input type="checkbox" onChange={(e) => setPatientNameChecked(e.target.checked)}/>
                <br></br>

                <label>Drug</label>
                <input type="text" value={drugName} disabled/>
                <input type="checkbox" onChange={(e) => setDrugNameChecked(e.target.checked)}/>
                <br></br>

                <label>Physician</label>
                <input type="text" value={physicianName} disabled/>
                <input type="checkbox" onChange={(e) => setPhysicianNameChecked(e.target.checked)}/>
                <br></br>

                <label>Initiator</label>
                <input type="text" value={initiator} disabled/>
                <input type="checkbox" onChange={(e) => setInitiatorChecked(e.target.checked)}/>
                <br></br>

                <label>SIG Code</label>
                <input type="text" value={SIG} disabled/>
                <input type="checkbox" onChange={(e) => setSIGChecked(e.target.checked)}/>
                <br></br>

                <label>SIG Description</label>
                <input type="text" value={SIGDescription} disabled/>
                <input type="checkbox" onChange={(e) => setSIGDescriptionChecked(e.target.checked)}/>
                <br></br>

                <label>Form</label>
                <input type="text" value={form} disabled/>
                <input type="checkbox" onChange={(e) => setFormChecked(e.target.checked)}/>
                <br></br>

                <label>Route</label>
                <input type="text" value={route} disabled/>
                <input type="checkbox" onChange={(e) => setRouteChecked(e.target.checked)}/>
                <br></br>

                <label>Prescribed Dose</label>
                <input type="text" value={prescribedDose} disabled/>
                <input type="checkbox" onChange={(e) => setPrescribedDoseChecked(e.target.checked)}/>
                <br></br>

                <label>Frequency</label>
                <input type="text" value={frequency} disabled/>
                <input type="checkbox" onChange={(e) => setFrequencyChecked(e.target.checked)}/>
                <br></br>

                <label>Duration</label>
                <input type="text" value={duration} disabled/>
                <input type="checkbox" onChange={(e) => setDurationChecked(e.target.checked)}/>
                <br></br>

                <label>Quantity</label>
                <input type="text" value={quantity} disabled/>
                <input type="checkbox" onChange={(e) => setQuantityChecked(e.target.checked)}/>
                <br></br>

                <label>Start Date</label>
                <input type="text" value={startDate} disabled/>
                <input type="checkbox" onChange={(e) => setStartDateChecked(e.target.checked)}/>
                <br></br>

                <label>Start Time</label>
                <input type="text" value={startTime} disabled/>
                <input type="checkbox" onChange={(e) => setStartTimeChecked(e.target.checked)}/>
                <br></br>

                <label>Comments</label>
                <input type="text" value={comments} disabled/>
                <input type="checkbox" onChange={(e) => setCommentsChecked(e.target.checked)}/>
                <br></br>

                <button className="button" id="reject" onClick={RejectOrder}>Reject</button>
                <button className="button" id="verify" onClick={VerifyOrder} disabled={!allChecked}>Verify</button>

            </form>
        </div>

    )

}

export default VerifyOrder;