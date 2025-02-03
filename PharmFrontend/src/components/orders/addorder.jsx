//react imports
import {useState, useEffect} from 'react';
import {useCookies} from 'react-cookie';

//modal imports
import DrugLookupModal from '@components/modals/drugLookupModal.jsx';
import PatientLookupModal from '@components/modals/patientLookupModal.jsx';
import PhysicianLookupModal from '@components/modals/physicianLookupModal.jsx';

const BackendIP = import.meta.env.VITE_BackendIP
const BackendPort = import.meta.env.VITE_BackendPort
function AddOrder(){

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

    // Check the cookies
    const [cookies] = useCookies(['user', 'admin']);

    // Extract user and admin cookies
    const { user, admin } = cookies;

    //form submission
    const OnSubmit = async (e) =>{

        e.preventDefault();

        if (comments === '' || comments === null) setComments("No Comments");

        let order = {

            "PPR": patient["Patient ID"],
            "DIN": drug["DIN"],
            "PhysicianID": physician["Physician ID"],
            "Initiator": user,
            "SIG": SIG,
            "SIGDescription": SIGDesc,
            "Form": formForm,
            "Route": route,
            "Dose": formDose,
            "Frequency": frequency,
            "Duration": duration,
            "Quantity": quantity,
            "StartDate": startDate,
            "StartTime": startTime,
            "Comments": comments

        }

        //API call 
        try {

            const response = await fetch('https://'+BackendIP+':'+BackendPort+'/api/Order/addorder' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(order)
            });
            const data = await response.json();

            if (data.message == "Order successfully created.") {
                alert(data.message);
                location.reload();
            }
            else {
                alert(data.message);
                return;
            }
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
            formatted = "EX: (" + drug["Dosage"] + ")";
            setFormDbDose(formatted);
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
                <input className="text-input" id="orderDose" required={true} value={formDose} onChange={(e) => setFormDose(e.target.value)}></input>
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
                <input className="text-input" id="orderForm" required={true} value={formForm} onChange={(e) => setFormForm(e.target.value)}></input> <br></br>

                <label htmlFor="orderRoute">Route:</label>
                <input className="text-input" id="orderRoute" required={true} value={route} onChange={(e) => setRoute(e.target.value)}></input> <br></br>

                <label htmlFor="orderFrequency">Frequency:</label>
                <input className="text-input" id="orderFrequency" required={true} value={frequency} onChange={(e) => setFrequency(e.target.value)}></input> <br></br>

                <label htmlFor="orderDuration">Duration:</label>
                <input className="text-input" id="orderDuration" required={true} value={duration} onChange={(e) => setDuration(e.target.value)}></input> <br></br>

                <label htmlFor="orderQuantity">Quantity:</label>
                <input className="text-input" id="orderQuantity" required={true} value={quantity} onChange={(e) => setQuantity(e.target.value)}></input>

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
                <input type="text" id="orderSIG" className="text-input" required={true} value={SIG} onChange={(e) => setSIG(e.target.value)}></input> <br></br>

                <label htmlFor="orderStart">SIG Description:</label>
                <input type="text" id="orderStart" className="text-input" required={true} value={SIGDesc} onChange={(e) => setSIGDesc(e.target.value)}></input> <br></br>

                <label htmlFor="orderStart">Start Date:</label>
                <input type="date" id="orderStart" className="date-input" required={true} value={startDate} onChange={(e) => setStartDate(e.target.value)}></input> <br></br>

                <label htmlFor="orderTime">Start Time:</label>
                <input id="orderTime" className="text-input" required={true} value={startTime} onChange={(e) => setStartTime(e.target.value)}></input>
                <label>XX:XX Format (24h)</label> <br></br>

                <label htmlFor="orderComments">Comments:</label>
                <input type="text" id="orderComments" className="text-input" required={true} value={comments} onChange={(e) => setComments(e.target.value)}></input> <br></br>

                <button type="submit" className="button" required={true} onClick={OnSubmit}>Submit</button>

            </form>
            
        </div>


    )

}

export default AddOrder;